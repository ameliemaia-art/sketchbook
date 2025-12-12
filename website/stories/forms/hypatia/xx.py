import pymel.core as pm
import math
import pymel.core.datatypes as datatypes

def point_in_polygon(pt, poly):
    """
    2D point-in-polygon test using the ray-casting algorithm.
    
    Parameters:
        pt (tuple): (u, v) coordinates of the point.
        poly (list): List of (u, v) tuples defining a closed polygon.
    
    Returns:
        bool: True if the point is inside the polygon.
    """
    x, y = pt
    inside = False
    n = len(poly)
    for i in range(n):
        j = (i - 1) % n
        xi, yi = poly[i]
        xj, yj = poly[j]
        # Check if point is between the y-values of the edge.
        intersect = ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi + 1e-10) + xi)
        if intersect:
            inside = not inside
    return inside

def distribute_cubes_on_dodecahedron(big_size=25, grid=10, small_dims=(0.5, 0.5, 5.0)):
    """
    Creates a dodecahedron scaled to big_size and distributes small cuboids
    on each face. For each face, the cuboids are distributed on a grid computed in
    the face's plane (using the face's bounding box in UV space) and only positions
    inside the face (assumed pentagonal) are used.
    
    The small cuboid dimensions are specified by small_dims. The largest value is
    assumed to be the flush dimension (aligned with the face normal). The cuboid is 
    created with width=grid_dims[0], height=grid_dims[1], and depth=flush_dim, then 
    rotated so that its local Z-axis aligns with the face normal.
    
    Each face's cubes are grouped into a face-specific group, and all such groups
    are parented under a master group.
    
    Parameters:
        big_size (float): Overall scale of the dodecahedron.
        grid (int): Number of grid cells along each direction (grid x grid).
        small_dims (tuple): Three values for the cuboid dimensions. The largest is the flush dimension.
    """
    # Determine flush dimension and the other two grid dimensions.
    flush_dim = max(small_dims)
    grid_dims = [d for d in small_dims if d != flush_dim]
    if len(grid_dims) < 2:
        dims_list = list(small_dims)
        dims_list.remove(flush_dim)
        grid_dims = dims_list

    # Create the dodecahedron.
    # Use "dodecahedron" as the type string.
    dodec = pm.polyPlatonic( r=big_size/2.0)[0]
    dodec = pm.rename(dodec, "dodecahedron")
    dodecShape = dodec.getShape()
    
    face_groups = []  # To collect groups per face.
    
    # Iterate over each face of the dodecahedron.
    for i, face in enumerate(dodecShape.f):
        # Get the vertices (world positions) for this face.
        verts = pm.polyListComponentConversion(face, toVertex=True)
        verts = pm.ls(verts, flatten=True)
        if not verts:
            continue
        
        pts = [datatypes.Vector(pm.pointPosition(v, world=True)) for v in verts]
        
        # Compute the face center as the average of the vertices.
        center = sum(pts, datatypes.Vector(0, 0, 0)) / len(pts)
        
        # Compute the face normal using the first three vertices.
        if len(pts) < 3:
            continue
        v0, v1, v2 = pts[0], pts[1], pts[2]
        normal = (v1 - v0).cross(v2 - v0).normal()
        
        # Construct a local coordinate system for the face.
        arbitrary = datatypes.Vector(1, 0, 0)
        if abs(normal.dot(arbitrary)) > 0.9:
            arbitrary = datatypes.Vector(0, 1, 0)
        tangent = (arbitrary - normal * normal.dot(arbitrary)).normal()
        binormal = normal.cross(tangent).normal()
        
        # Project the face's vertices into the local 2D (UV) plane.
        poly_uv = []
        for pt in pts:
            rel = pt - center
            u = rel.dot(tangent)
            v = rel.dot(binormal)
            poly_uv.append((u, v))
        
        # Compute bounding box in UV coordinates.
        us = [uv[0] for uv in poly_uv]
        vs = [uv[1] for uv in poly_uv]
        min_u, max_u = min(us), max(us)
        min_v, max_v = min(vs), max(vs)
        spacing_u = (max_u - min_u) / float(grid)
        spacing_v = (max_v - min_v) / float(grid)
        
        # Collect small cuboids for this face.
        face_cubes = []
        for iu in range(grid):
            for iv in range(grid):
                # Center of grid cell in UV.
                u = min_u + spacing_u/2.0 + iu * spacing_u
                v = min_v + spacing_v/2.0 + iv * spacing_v
                # Check if this UV point lies inside the polygon.
                if not point_in_polygon((u, v), poly_uv):
                    continue
                # Compute world position for the small cuboid.
                pos = center + tangent * u + binormal * v + normal * (flush_dim / 2.0)
                
                # Create the small cuboid.
                cube = pm.polyCube(w=grid_dims[0], h=grid_dims[1], d=flush_dim)[0]
                # Construct transformation matrix aligning the cuboid's local axes:
                # local X -> tangent, local Y -> binormal, local Z -> normal.
                m = datatypes.Matrix([
                    [tangent.x, binormal.x, normal.x, pos.x],
                    [tangent.y, binormal.y, normal.y, pos.y],
                    [tangent.z, binormal.z, normal.z, pos.z],
                    [0,         0,          0,      1]
                ])
                cube.setMatrix(m, worldSpace=True)
                face_cubes.append(cube)
        
        # Group the cubes for this face if any were created.
        if face_cubes:
            face_grp = pm.group(face_cubes, name="dodec_face_{:02d}_group".format(i))
            face_groups.append(face_grp)
    
    # Group all face groups into a master group.
    if face_groups:
        master_grp = pm.group(face_groups, name="dodec_smallCubes_Master")
    else:
        master_grp = None

# Example usage:
distribute_cubes_on_dodecahedron(big_size=25, grid=10, small_dims=(0.5, 0.5, 5.0))
