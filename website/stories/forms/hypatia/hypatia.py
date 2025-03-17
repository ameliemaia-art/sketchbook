import pymel.core as pm
import math

# ========================================
# STEP 1: Define Parameters
# ========================================
circle_radius = 1.0      # Outer circle radius
cross_thickness = 0.2    # Thickness of the cross arms
arc_sections = 8         # Number of subdivisions for the arc

# Compute intersection points where the cross meets the circle
x_intersect = math.sqrt(circle_radius**2 - cross_thickness**2)
y_intersect = math.sqrt(circle_radius**2 - cross_thickness**2)

pt_horizontal = (x_intersect, cross_thickness, 0)  # Intersection on horizontal bar
pt_vertical = (cross_thickness, y_intersect, 0)    # Intersection on vertical bar
pt_corner = (cross_thickness, cross_thickness, 0)  # Bottom-left corner of the cross

# Compute angles for arc
angle_start = math.degrees(math.atan2(cross_thickness, x_intersect))  
angle_end = math.degrees(math.atan2(y_intersect, cross_thickness))  

# Lerp function for smooth angle interpolation
def lerp(a, b, t):
    return a + (b - a) * t

# ========================================
# STEP 2: Generate Points for the Closed Quadrant Curve
# ========================================
points = []

# 1️⃣ Start from bottom-left corner
points.append(pt_corner)

# 2️⃣ Move right to horizontal intersection
points.append(pt_horizontal)

# 3️⃣ Generate arc points smoothly from horizontal to vertical intersection
arc_points = []
for i in range(arc_sections + 1):  # Ensure we include the endpoint
    angle = math.radians(lerp(angle_start, angle_end, i / arc_sections))
    x = math.cos(angle) * circle_radius
    y = math.sin(angle) * circle_radius
    arc_points.append((x, y, 0))

# Append arc points
points.extend(arc_points)

# 4️⃣ Move left to top-right corner of the cross
points.append(pt_vertical)

# 5️⃣ Move down back to bottom-left corner (closing the loop)
points.append(pt_corner)

# ========================================
# STEP 3: Create and Close the Curve
# ========================================
quadrant_curve = pm.curve(d=1, p=points, name="quadrantProfile")

# Cleanup history and freeze transforms
pm.makeIdentity(quadrant_curve, apply=True, translate=True, rotate=True, scale=True)
pm.delete(quadrant_curve, constructionHistory=True)

print("✅ Fully closed quadrant curve created successfully!")


# =============================
# 1️⃣ Ensure `quadrant_curve` Exists
# =============================
quadrant_curve = "quadrantProfile"  # This must be the name of your closed profile curve

if not pm.objExists(quadrant_curve):
    raise RuntimeError("❌ ERROR: quadrant_curve ('quadrantProfile') does not exist! Run the curve script first.")

# =============================
# 2️⃣ Create the Path Curve (Torus Outer Circle)
# =============================
outer_radius = 10  # Radius of the torus
path_divisions = 50  # More divisions = smoother torus
circle_path = pm.circle(radius=outer_radius, normal=(0, 1, 0), sections=path_divisions, name="torusPath")[0]

# =============================
# 3️⃣ Align & Rotate the Profile Curve (`quadrant_curve`)
# =============================
# Move `quadrant_curve` so it sits at the correct torus edge
pm.xform(quadrant_curve, translation=(outer_radius, 0, 0))

# Rotate the profile so it's **perpendicular to the path** (VERY IMPORTANT!)
pm.xform(quadrant_curve, rotation=(0, 90, 0), worldSpace=True)

# =============================
# 4️⃣ Perform the Sweep (Extrusion)
# =============================
swept_mesh = pm.extrude(
    quadrant_curve, circle_path, et=2, upn=True, fixedPath=True, scale=1, useComponentPivot=True, name="sweptTorus"
)[0]

# =============================
# 5️⃣ Cleanup
# =============================
pm.delete(quadrant_curve, circle_path)  # Remove construction curves
pm.select(swept_mesh)  # Select final mesh
print("✅ Successfully swept `quadrant_curve` around the torus path!")