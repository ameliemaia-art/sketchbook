# GitHub Copilot Instructions

## Project Overview

This is a creative coding project called "Sketchbook" focused on geometric patterns, sacred geometry, and interactive visualizations. The project combines mathematical precision with visual artistry.

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS + custom CSS
- **Graphics**: Three.js for 3D, Paper.js for 2D
- **Audio**: Web Audio API for sound synthesis and visualization
- **Development**: Component-driven with Storybook-style stories

## Creative Art Process

The art creation workflow follows a four-stage pipeline optimized for iterative design and rapid prototyping:

### 1. Blueprint Creation (2D Procedural Systems)

- **Tool**: Paper.js for 2D procedural generative systems
- **Environment**: Storybook for component-based sketching
- **Controls**: Tweakpane for real-time parameter adjustment
- **Output**: PNG exports via canvas.toBlob() for work-in-progress documentation
- **Philosophy**: Simplify complex 3D ideas in 2D form before 3D construction
- **Goal**: Explore variations through parametric control

### 2. Form Generation (3D Manifestation)

- **Tool**: Three.js prototype environment
- **Parameters**: Reuse blueprint parameters when possible, extend for 3D-specific features
- **Controls**: Tweakpane for 3D parameter exploration
- **Export**: FBX models or code porting to PyMel (time-intensive, prefer to avoid)
- **Challenge**: Need better subdivision/high-poly mesh generation directly in Three.js
- **Optimization Goal**: Eliminate Maya dependency by improving Three.js geometry capabilities

### 3. Model Optimization (Currently Maya)

- **Current**: Maya for geometry inspection and optimization
- **Future Goal**: Eliminate this step through improved Three.js workflows
- **Purpose**: Prepare models for Unreal Engine import

### 4. Final Composition (Unreal Engine)

- **Purpose**: Metaphysical sculptures that react to music
- **Workflow**: Import models, create Blueprints, assemble parts, material tweaking, motion programming
- **Challenge**: Time-intensive manual process, approach still evolving
- **Focus**: Music-reactive visualizations and sculptural presentations

### Process Optimization Priorities

1. **Eliminate Maya dependency**: Improve Three.js geometry generation capabilities
2. **Streamline 3D form creation**: Reduce custom code requirements through reusable utilities
3. **Enhance AI assistance**: Improve communication efficiency with Copilot for geometric code generation
4. **Maintain TypeScript velocity**: Leverage web development speed for rapid iteration

## Code Style Preferences

### TypeScript

- Use strict TypeScript configuration
- Prefer explicit types over `any`
- Use interfaces for object shapes and component props
- Implement proper error handling and null checks

### Component Structure

```typescript
// Preferred component pattern
export interface ComponentProps {
  // Clear, descriptive prop types
}

export const Component = (props: ComponentProps) => {
  // Implementation with proper cleanup
};

// Always include a corresponding story
export default {
  title: "Category/Component",
  component: Component,
};
```

### Mathematical Code

- Use descriptive variable names for geometric concepts (e.g., `goldenRatio`, `pentagonVertices`)
- Include JSDoc comments explaining mathematical formulas
- Prefer pure functions for calculations
- Use consistent units (radians for angles, normalized values 0-1 where applicable)
- Leverage the seeded math utilities in `utils/math-seeded.ts` for reproducible results

### Graphics Code (Three.js/Paper.js)

- Always implement proper resource disposal patterns
- Use the project's camera and rendering utilities from `utils/three/`
- Handle window resize events properly
- Include TypeScript types for all graphics objects
- Follow the cleanup patterns in existing components
- Use Threejs modules over THREE.js global imports
- **Blueprint-to-Form Workflow**: When converting 2D Paper.js blueprints to 3D Three.js forms, preserve parameter names and structures
- **Geometry Optimization**: Prioritize Three.js native geometry generation over external tools (Maya/PyMel)
- **Subdivision Surfaces**: Focus on Three.js solutions for high-poly mesh generation and subdivision
- **Parameter Consistency**: Maintain consistent parameter interfaces between blueprint and form stages
- **Export Capabilities**: Implement FBX export functionality and canvas blob exports for iteration documentation

### File Organization

- Group related functionality in directories
- Use barrel exports (`index.ts`) for clean imports
- Separate complex types into dedicated files
- Follow the existing `stories/` structure for new components

## Naming Conventions

- **Components**: PascalCase (e.g., `FlowerOfLife`, `VectorEquilibrium`)
- **Files**: kebab-case (e.g., `flower-of-life.ts`, `vector-equilibrium.stories.tsx`)
- **Functions/Variables**: camelCase (e.g., `calculateGoldenRatio`, `vertexPositions`)
- **Constants**: UPPER_CASE (e.g., `PHI`, `TWO_PI`)
- **Sacred geometry**: Use proper mathematical names (e.g., `tetrahedron`, `merkaba`, `vesicaPiscis`)

## Sacred Geometry & Mathematical Patterns

- Maintain mathematical accuracy in geometric constructions
- Use established ratios and proportions (golden ratio, sqrt(2), etc.)
- Reference mathematical sources in comments when implementing complex formulas
- Ensure patterns are scalable and resolution-independent

## Performance Considerations

- Optimize for real-time rendering (60fps target)
- Use requestAnimationFrame for animations
- Implement proper memory management for graphics resources
- Consider using Web Workers for heavy mathematical calculations

## Testing & Documentation

- Create stories for all visual components
- Include usage examples in component documentation
- Test mathematical accuracy with known values
- Verify cross-browser compatibility for WebGL features

## Common Patterns to Follow

1. **Component Creation**: Start with TypeScript interface, implement component, create story
2. **Mathematical Functions**: Pure functions with clear inputs/outputs and JSDoc
3. **Three.js Scenes**: Use project utilities, implement dispose patterns
4. **Audio Features**: Leverage existing sound utilities and frequency models

## Avoid

- Console.log statements in production code
- Magic numbers (use named constants)
- Inline styles (prefer CSS classes or styled-components)
- Blocking operations in render loops
- Memory leaks in graphics code

## Project-Specific Context

- The `stories/` directory contains both component examples and full applications
- Sacred geometry patterns should be mathematically accurate, not approximations
- Audio and visual elements often work together - consider synesthetic relationships
- The project values both educational content and artistic expression
