import pymel.core as pm
import math

RADIUS = 25.0
TORUS_SUBDIVISIONS = 200.0

# Outline
OUTLINE_RADIUS = 1
ORBIT_PROFILE_RADIUS = 1

# Hypatia
HYPATIA_RADIUS = 0.05

# Orbit
ORBIT_THICKNESS = 0.005
ORBIT_HEIGHT = HYPATIA_RADIUS

# ----------------------------------------------------
# Utility Function: Linear Interpolation (lerp)
# ----------------------------------------------------
def lerp(a, b, t):
    """Linearly interpolate between a and b by t."""
    return a + (b - a) * t

def create_light_torus(major_radius=10, minor_radius=1, subdivisions_major=20, subdivisions_minor=10, name="regularTorus"):
    """
    Creates a regular torus mesh using the polyTorus command.

    Parameters:
      major_radius (float): The major (ring) radius of the torus.
      minor_radius (float): The minor (tube) radius of the torus.
      subdivisions_major (int): Number of subdivisions around the torus ring.
      subdivisions_minor (int): Number of subdivisions along the tube.
      name (str): The name for the torus mesh.

    Returns:
      PyNode: The created torus mesh.
    """
    torus_mesh = pm.polyTorus(r=major_radius, sr=minor_radius, sx=subdivisions_major, sy=subdivisions_minor, name=name)[0]
    pm.select(torus_mesh)
    print("Regular torus mesh created successfully!")
    return torus_mesh


# ----------------------------------------------------
# Function: Create a Closed Quadrant Profile
# ----------------------------------------------------
def create_quadrant_profile(circle_radius=1.0, cross_thickness=0.5, arc_sections=8):
    """
    Creates a fully closed quadrant curve profile.
    
    The profile:
      1. Starts at the bottom-left corner of the cross.
      2. Goes to the horizontal intersection.
      3. Follows an arc (using lerp for smooth spacing) from the horizontal to vertical intersection.
      4. Ends at the vertical intersection and closes back at the corner.
    """
    # Compute intersection points.
    x_intersect = math.sqrt(circle_radius**2 - cross_thickness**2)
    y_intersect = math.sqrt(circle_radius**2 - cross_thickness**2)
    
    pt_horizontal = (x_intersect, cross_thickness, 0)   # Intersection on horizontal bar.
    pt_vertical   = (cross_thickness, y_intersect, 0)    # Intersection on vertical bar.
    pt_corner     = (cross_thickness, cross_thickness, 0)  # Bottom-left corner.
    
    # Compute arc angles.
    angle_start = math.degrees(math.atan2(cross_thickness, x_intersect))
    angle_end   = math.degrees(math.atan2(y_intersect, cross_thickness))
    
    # Build list of points.
    points = []
    points.append(pt_corner)         # Start at corner.
    points.append(pt_horizontal)     # Go to horizontal intersection.
    
    # Generate arc points using lerp for smooth spacing.
    arc_points = []
    for i in range(arc_sections + 1):  # Include endpoint.
        angle = math.radians(lerp(angle_start, angle_end, i / arc_sections))
        x = math.cos(angle) * circle_radius
        y = math.sin(angle) * circle_radius
        arc_points.append((x, y, 0))
    points.extend(arc_points)
    
    points.append(pt_vertical)       # Move to vertical intersection.
    points.append(pt_corner)         # Close loop.
    
    # Create the curve.
    quadrant_curve = pm.curve(d=1, p=points, name="quadrantProfile")
    pm.makeIdentity(quadrant_curve, apply=True, translate=True, rotate=True, scale=True)
    pm.delete(quadrant_curve, constructionHistory=True)
    
    print("✅ Fully closed quadrant curve created successfully!")
    return quadrant_curve

# ----------------------------------------------------
# Function: Sweep a Profile Along a Circular Path
# ----------------------------------------------------
def sweep_profile(profile_curve, torus_radius=10, path_divisions=50):

    print(torus_radius)
    """
    Sweeps the provided profile curve along a circular path to create a torus-like mesh.
    
    The profile is moved to the torus edge and rotated so that it is perpendicular to the path.
    """
    # Create the circular sweep path.
    circle_path = pm.circle(radius=torus_radius, normal=(0, 1, 0), 
                            sections=path_divisions, name="torusPath")[0]
    
    # Align the profile: move it so its origin sits at the torus edge.
    pm.xform(profile_curve, translation=(torus_radius, 0, 0))
    # Rotate the profile so that it's perpendicular to the path.
    pm.xform(profile_curve, rotation=(0, 90, 0), worldSpace=True)
    
    # Perform the sweep (extrude in pipe mode).
    swept = pm.extrude(profile_curve, circle_path, et=2, upn=True, 
                       fixedPath=True, scale=1, useComponentPivot=True, 
                       name="sweptTorus")[0]
    
    # Cleanup the construction curves.
    pm.delete(profile_curve, circle_path)
    return swept

# ----------------------------------------------------
# MAIN PROCESS: Duplicate, Sweep, and Combine Quadrants
# ----------------------------------------------------
def create_motion_orbit_sculpture():
    circle_radius = OUTLINE_RADIUS*ORBIT_PROFILE_RADIUS
    # Create the original quadrant profile.
    original_profile = create_quadrant_profile(circle_radius=circle_radius, cross_thickness=circle_radius*0.25, arc_sections=8)
    
    swept_meshes = []
    # Define the rotation angles for the four quadrants.
    for angle in [0, 90, 180, 270]:
        # Duplicate the original quadrant profile.
        profile_dup = pm.duplicate(original_profile)[0]
        # Rotate it about the Z-axis by the specified angle.
        pm.xform(profile_dup, rotation=(0, 0, angle), relative=True, worldSpace=True)
        pm.makeIdentity(profile_dup, apply=True, translate=True, rotate=True, scale=True)
        # Sweep the rotated profile along the torus path.
        swept = sweep_profile(profile_dup, torus_radius=OUTLINE_RADIUS*RADIUS, path_divisions=TORUS_SUBDIVISIONS)
        # swept_meshes.append(swept)

        poly_mesh = pm.nurbsToPoly(swept, format=3, polygonType=1, name="polySweptTorus")[0]
        pm.polyNormal(poly_mesh, normalMode=0, userNormalMode=0)
        pm.delete(swept)
        swept_meshes.append(poly_mesh)
    
    
    # Combine all the swept meshes into one final torus.
    full_torus = pm.polyUnite(swept_meshes, ch=False, mergeUVSets=True, name="motion_structure")[0]
    pm.delete(full_torus, constructionHistory=True)
    pm.select(full_torus)
    pm.polyNormal(full_torus, normalMode=0, userNormalMode=0)
    print("✅ Successfully created a full torus from individual quadrant sweeps!")


    light = create_light_torus(OUTLINE_RADIUS*RADIUS, 0.1, TORUS_SUBDIVISIONS, 25, "motion_structure_light")

    group = pm.group(em=True, name="motion_structure_group")
    pm.parent(full_torus, group)
    pm.parent(light, group)
    pm.xform(group, centerPivots=True)
    pm.delete(original_profile)

    return group



def create_outline(group, total=1):
    groupX = pm.group(em=True, name="structure_x_group")
    groupY = pm.group(em=True, name="structure_y_group")
    groupZ = pm.group(em=True, name="structure_z_group")
    for i in range(total):
          theta = i * (360 / total)
          
          meshX = pm.duplicate(group)[0]
          meshZ = pm.duplicate(group)[0]
          pm.parent(meshX, groupX)
          pm.parent(meshZ, groupZ)

          meshX.rename("motion_structure_X")
          meshZ.rename("motion_structure_Z")

          meshX.rotateX.set(theta)
          meshZ.rotate.set(0, 90, theta)

          if i != 0:
            meshY = pm.duplicate(group)[0]
            meshY.rename("motion_structure_Y")
            meshY.rotate.set(90, theta, 0)
            pm.parent(meshY, groupY)

    pm.delete(group)
    group2 = pm.group(em=True, name="motion_structure")
    pm.parent(groupX, group2)
    pm.parent(groupY, group2)
    pm.parent(groupZ, group2)
    return group2

def create_hypatia():
    radius = float(RADIUS * HYPATIA_RADIUS)
    print(radius)
    sphere = pm.polySphere(name="hypatia", radius=radius, subdivisionsX=100, subdivisionsY=50)
    return sphere




def create_orbit():
    total = 7
    thickness = RADIUS * ORBIT_THICKNESS
    extrusion_thickness = RADIUS * ORBIT_THICKNESS
    height = RADIUS * ORBIT_HEIGHT
    min_radius = RADIUS / 5
    max_radius = RADIUS * (6/7)
    SM_AXIS_RATIO = 1 / math.sqrt(3)  # ~0.577
    group = pm.group(em=True, name="orbit_group")

    orbit_meshes = []
    ring_speeds = []
    planets = []

    for i in range(total):
        p = i / (total - 1) if total > 1 else 0
        ring_radius = min_radius + p * (max_radius - min_radius)
        perspective_factor_y = SM_AXIS_RATIO + p * (SM_AXIS_RATIO * (1 + SM_AXIS_RATIO) - SM_AXIS_RATIO)

        # Create an ellipse curve (NURBS) as the extrusion path.
        ellipse = pm.circle(radius=ring_radius, normal=(0, 1, 0), sections=100, name=f'Ellipse_{i}')[0]
        pm.xform(ellipse, scale=(perspective_factor_y, 1, 1))  # Apply elliptical scaling

        # Create a polyPlane as the base for our square profile.
        profile_poly = pm.polyPlane(width=height, height=height, subdivisionsX=1, subdivisionsY=1,
                                    name=f'ProfilePoly_{i}')[0]
        pm.xform(profile_poly, scale=(extrusion_thickness, 1, 1))  # Apply elliptical scaling
        # Ensure the polyPlane is oriented properly.
        pm.xform(profile_poly, rotation=(90, 90, 0))

        # Convert the polyPlane to a NURBS curve (a "nurb square").
        edges = pm.polyListComponentConversion(profile_poly, toEdge=True)
        pm.select(edges, r=True)
        profile_curve = pm.polyToCurve(form=2, degree=1, name=f'ProfileCurve_{i}')[0]
        pm.delete(profile_poly)  # Remove the original polygon.
        pm.select(clear=True)

        # Extrude the square profile (NURBS curve) along the ellipse path.
        # fpt=False allows the profile to follow the path's twist.
        extruded_ring = pm.extrude(profile_curve, ellipse, et=2, ucp=True, fpt=False, name=f'Ring_{i}')[0]
        pm.delete(profile_curve)  # Clean up the temporary profile curve.

        # Convert the NURBS extruded surface to a polygon mesh.
        ring_mesh = pm.nurbsToPoly(extruded_ring, mnd=0, ch=0)[0]
        pm.delete(extruded_ring)  # Optionally remove the original NURBS surface.


        pm.select(ring_mesh)
        pm.polyNormal(ring_mesh, normalMode=0, userNormalMode=0)
        pm.polySoftEdge(ring_mesh, angle=0, ch=1)

        # Center the extruded (and converted) ring mesh.
        bbox = pm.exactWorldBoundingBox(ring_mesh)
        center = ((bbox[0] + bbox[3]) / 2.0,
                  (bbox[1] + bbox[4]) / 2.0,
                  (bbox[2] + bbox[5]) / 2.0)
        pm.move(-center[0], -center[1], -center[2], ring_mesh, r=True)

        pm.xform(ring_mesh, centerPivots=True)
        pm.rotate(ring_mesh, lerp(-45, -90, p), 0, 0)

        pm.delete(ellipse)
        orbit_meshes.append(ring_mesh)
        pm.parent(ring_mesh, group)

        # Planet creation code can go here if needed.
    
    return orbit_meshes, ring_speeds, planets



# Run the full process.
create_outline(create_motion_orbit_sculpture(), total=5)
create_orbit()
create_hypatia()