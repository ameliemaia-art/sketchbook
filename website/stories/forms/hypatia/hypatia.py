import pymel.core as pm
import math

# ----------------------------------------------------
# Utility Function: Linear Interpolation (lerp)
# ----------------------------------------------------
def lerp(a, b, t):
    """Linearly interpolate between a and b by t."""
    return a + (b - a) * t

# ----------------------------------------------------
# Function: Create a Closed Quadrant Profile
# ----------------------------------------------------
def create_quadrant_profile(circle_radius=1.0, cross_thickness=0.2, arc_sections=8):
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
def create_full_torus():
    # Create the original quadrant profile.
    original_profile = create_quadrant_profile(circle_radius=1.0, cross_thickness=0.2, arc_sections=8)
    
    swept_meshes = []
    # Define the rotation angles for the four quadrants.
    for angle in [0, 90, 180, 270]:
        # Duplicate the original quadrant profile.
        profile_dup = pm.duplicate(original_profile)[0]
        # Rotate it about the Z-axis by the specified angle.
        pm.xform(profile_dup, rotation=(0, 0, angle), relative=True, worldSpace=True)
        pm.makeIdentity(profile_dup, apply=True, translate=True, rotate=True, scale=True)
        # Sweep the rotated profile along the torus path.
        swept = sweep_profile(profile_dup, torus_radius=10, path_divisions=50)
        swept_meshes.append(swept)
    
    # Combine all the swept meshes into one final torus.
    full_torus = pm.polyUnite(swept_meshes, ch=False, mergeUVSets=True, name="fullTorus")[0]
    pm.delete(full_torus, constructionHistory=True)
    pm.select(full_torus)
    print("✅ Successfully created a full torus from individual quadrant sweeps!")
    return full_torus

# Run the full process.
create_full_torus()
