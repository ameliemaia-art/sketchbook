# Column Base Blueprint

A parametric 2D blueprint for creating classical column base profiles using Paper.js. This component follows traditional architectural proportions with a simplified, elegant approach.

## Classical Elements

The column base consists of five stackable elements that build from bottom to top:

### 1. Square Plinth
- **Purpose**: Rectangular foundation providing stability and visual weight
- **Parameters**: 
  - Height: Relative to column radius (default: 0.2)
  - Width: Relative to column radius (default: 1.3)
- **Form**: Clean rectangular base without complex bevels

### 2. Lower Torus
- **Purpose**: Primary convex molding creating visual transition from plinth
- **Parameters**:
  - Height: Vertical dimension (default: 0.15)
  - Radius: Bulge radius (default: 0.12)
- **Form**: Quarter-circle bulging outward

### 3. Middle Torus
- **Purpose**: Secondary convex molding adding visual richness
- **Parameters**:
  - Height: Vertical dimension (default: 0.12)
  - Radius: Bulge radius (default: 0.08)
- **Form**: Smaller quarter-circle profile

### 4. Upper Torus
- **Purpose**: Tertiary convex molding creating layered detail
- **Parameters**:
  - Height: Vertical dimension (default: 0.1)
  - Radius: Bulge radius (default: 0.06)
- **Form**: Progressively smaller torus

### 5. Shaft Torus
- **Purpose**: Final transition molding connecting base to column shaft
- **Parameters**:
  - Height: Vertical dimension (default: 0.08)
  - Radius: Bulge radius (default: 0.04)
- **Form**: Subtle transition curve

## Features

- **Simplified Design**: Clean, stackable layers without complex curves
- **Parametric Control**: All proportions relative to column radius
- **Individual Layer Control**: Each molding can be toggled independently
- **Debug Visualization**: Shows construction points and labels
- **Revolution Lines**: Horizontal indicators showing 3D revolved form
- **Real-time Updates**: Tweakpane integration for immediate feedback

## Mathematical Approach

The profile uses a straightforward stacking system:

1. **Square Foundation**: Simple rectangular plinth base
2. **Torus Stacking**: Each torus layer builds upon the previous radius
3. **Quarter-Circle Profiles**: Clean geometric bulges using trigonometric calculations
4. **Progressive Scaling**: Each layer gets slightly smaller, creating classical proportion

## Torus Geometry

Each torus uses a quarter-circle that:
- Starts from the current profile edge
- Bulges outward by the specified radius
- Creates smooth convex curves
- Stacks properly with the next layer

## Usage in 3D Form Generation

This simplified blueprint translates efficiently to 3D:

1. **Revolution**: Profile can be revolved around Y-axis for full 3D base
2. **Layer Export**: Each element can be extruded separately if needed
3. **Parameter Consistency**: Settings map directly to Three.js geometry
4. **FBX Export Ready**: Clean geometry suitable for external applications

## Stories

- **Default**: Complete base with all five layers
- **Plinth Only**: Foundation study
- **Torus Study**: Focus on the multiple torus layers
- **Debug Mode**: Construction visualization

## Design Philosophy

This implementation prioritizes:
- **Clarity**: Simple, understandable geometry
- **Flexibility**: Easy parameter adjustment
- **Classical Accuracy**: Proper proportional relationships
- **3D Readiness**: Designed for efficient form generation

The simplified approach makes it easier to iterate and understand while maintaining the essential character of classical column bases.
