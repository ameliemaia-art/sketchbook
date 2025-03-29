import pymel.core as pm
import pymel.core.datatypes as dt
import math

RADIUS = 25.0
TORUS_SUBDIVISIONS = 200.0

# Outline
OUTLINE_RADIUS = 1
ORBIT_PROFILE_RADIUS = 0.5

# Hypatia
HYPATIA_RADIUS = 0.05

# Orbit
ORBIT_THICKNESS = 0.0025
ORBIT_HEIGHT = HYPATIA_RADIUS*2

# ----------------------------------------------------
# Utility Function: Linear Interpolation (lerp)
# ----------------------------------------------------
def lerp(a, b, t):
    """Linearly interpolate between a and b by t."""
    return a + (b - a) * t

 # Define the mapLinear equivalent function
def mapLinear(value, in_min, in_max, out_min, out_max):
    return out_min + (value - in_min) * (out_max - out_min) / (in_max - in_min)

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
    return torus_mesh


def adjust_uvs_to_range(mesh, projection_scale_u=1, projection_scale_v=1):
    """
    Adjusts the UVs of a given mesh to ensure they fit within the 0-1 range using cylindrical mapping.
    
    Parameters:
    - mesh: The mesh to adjust the UVs for.
    - projection_scale_u: Scaling factor for U-axis in cylindrical projection (default is 1).
    - projection_scale_v: Scaling factor for V-axis in cylindrical projection (default is 1).
    """
    # Perform cylindrical projection
    pm.select(mesh)
    pm.polyCylindricalProjection(mesh, projectionScaleU=projection_scale_u, projectionScaleV=projection_scale_v, smartFit=True)
    
    # Now adjust the UV coordinates to ensure they fit in the 0-1 range.
    uvs = pm.polyListComponentConversion(mesh, toUV=True)
    uvs = pm.ls(uvs, flatten=True)

    # Calculate the range of UVs along U-axis
    min_u = float('inf')
    max_u = float('-inf')

    # Loop through each UV and calculate its U value
    for uv in uvs:
        u_value = pm.polyEditUV(uv, query=True, u=True)[0]
        min_u = min(min_u, u_value)
        max_u = max(max_u, u_value)

    # Apply mapLinear and clamp the values to the range [0, 1]
    for uv in uvs:
        u_value = pm.polyEditUV(uv, query=True, u=True)[0]
        mapped_u = mapLinear(u_value, min_u, max_u, 0.0, 1.0)
        clamped_u = max(0.0, min(1.0, mapped_u))  # Clamp the value to [0, 1]
        pm.select(uv)  # Select the individual UV
        pm.polyEditUV(pivotU=0.5, pivotV=0.5, uValue=clamped_u, relative=False)  # Apply the new UV value


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
    return quadrant_curve

# ----------------------------------------------------
# Function: Sweep a Profile Along a Circular Path
# ----------------------------------------------------
def sweep_profile(profile_curve, torus_radius=10, path_divisions=50):

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

        # Create a polyPlane as the base for our square profile.
        profile_poly = pm.polyPlane(width=height, height=height, subdivisionsX=1, subdivisionsY=1,
                                    name=f'ProfilePoly_{i}')[0]
        # Scale the plane to get the desired extrusion thickness.
        pm.xform(profile_poly, scale=(extrusion_thickness, 1, 1))
        # Rotate it so the face is oriented correctly for the sweep.
        pm.xform(profile_poly, rotation=(90, 90, 0))

        # Convert the polyPlane to a NURBS curve ("nurb square") by converting its border edges.
        edges = pm.polyListComponentConversion(profile_poly, toEdge=True)
        pm.select(edges, r=True)
        profile_curve = pm.polyToCurve(form=2, degree=1, name=f'ProfileCurve_{i}')[0]
        pm.delete(profile_poly)
        pm.select(clear=True)

        circle_path = pm.circle(radius=ring_radius, normal=(0, 1, 0), 
                                sections=TORUS_SUBDIVISIONS, name="torusPath")[0]
        pm.xform(circle_path, scale=(perspective_factor_y, 1, 1))  # Apply elliptical scaling
        
        # Align the profile: move it so its origin sits at the torus edge.
        pm.xform(profile_curve, translation=(ring_radius, 0, 0))
        # Rotate the profile so that it's perpendicular to the path.
        pm.xform(profile_curve, rotation=(0, 90, 0), worldSpace=True)
        
        # Perform the sweep (extrude in pipe mode).
        swept = pm.extrude(profile_curve, circle_path, et=2, upn=True, 
                        fixedPath=True, scale=1, useComponentPivot=True, 
                        name="sweptTorus")[0]
        
        poly_mesh = pm.nurbsToPoly(swept, format=3, polygonType=1, name="polySweptTorus")[0]
        pm.polySoftEdge(poly_mesh, angle=0, ch=1)

        pm.delete(swept)
    
        # Cleanup the construction curves.
        pm.delete(profile_curve, circle_path)

        # Center the resulting swept mesh.
        bbox = pm.exactWorldBoundingBox(poly_mesh)
        center = ((bbox[0] + bbox[3]) / 2.0,
                  (bbox[1] + bbox[4]) / 2.0,
                  (bbox[2] + bbox[5]) / 2.0)
        pm.move(-center[0], -center[1], -center[2], poly_mesh, r=True)
        pm.xform(poly_mesh, centerPivots=True)
        # pm.rotate(poly_mesh, lerp(45, 270, p), 0, lerp(0, 270, p))

            # --- Separate the inner side of poly_mesh ---
        # Here we calculate the full 3D distance from (0,0,0) for each face's center.

        mm = pm.PyNode(poly_mesh)

        # Duplicate the mesh
        inner_side = pm.duplicate(mm, name="inner")[0]
        outer_side = pm.duplicate(mm, name="outer")[0]

        # Define face range (adjust dynamically if needed)
        face_count = len(mm.faces)-1

        # Delete inner faces from the outer mesh
        pm.delete(outer_side.f[0:599])

        # Delete outer faces from the inner mesh
        pm.delete(inner_side.f[600:face_count])

        ringGroup = pm.group(em=True, name="orbit")

        # Parent both parts to the group
        pm.parent(inner_side, ringGroup)
        pm.parent(outer_side, ringGroup)

        pm.parent(ringGroup, group)

        # Cleanup
        pm.delete(mm)  
                
        # orbit_meshes.append(poly_mesh)
        # pm.parent(poly_mesh, group)

        # UV Mapping using Cylindrical Projection
        adjust_uvs_to_range(outer_side, projection_scale_u=1, projection_scale_v=1)
        adjust_uvs_to_range(inner_side, projection_scale_u=1, projection_scale_v=1)

    pm.select(clear=True)
    return orbit_meshes, ring_speeds, planets



# distribute_cubes_on_cube(big_size=500, grid=10, small_dims=(1, 1, 50.0))
# create_outline(create_motion_orbit_sculpture(), total=5)
create_orbit()
# create_hypatia()