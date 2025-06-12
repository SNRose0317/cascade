# Web3 Diagnostics CSS Structure

This directory contains the main styling for the Web3 Diagnostics platform. The CSS is organized with a component-based approach while maintaining global variables for consistency.

## Overview

The styling system follows these principles:
- CSS variables for consistent theming
- Mobile-first responsive design
- Component-based organization
- Minimal use of external libraries

## CSS Variables

Global design tokens are defined as CSS variables at the root level:

```css
:root {
    --primary-color: #e4a11b;      /* Brand yellow/gold */
    --secondary-color: #1e2637;    /* Dark blue/slate */
    --dark-blue: #171e2e;          /* Darker blue for backgrounds */
    --light-text: #ffffff;         /* White text */
    --gray-text: #a0a8b9;          /* Gray text for secondary content */
    --card-bg: #242f44;            /* Card background color */
    --transition: all 0.3s ease;   /* Standard transition */
    --box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Standard shadow */
}
```

These variables allow for easy theme customization and ensure consistency across components.

## Layout System

The layout is built on a simple grid system:
- Container with max-width for content positioning
- CSS Grid for multi-column layouts
- Flexbox for component-level alignment

Example:
```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.features .container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}
```

## Component Styles

Each main UI component has its own section in the CSS file:

| Section | Purpose |
|---------|---------|
| Global Styles | Base styles and utilities |
| Header | Navigation and search |
| Hero Section | Main banner/hero area |
| Features | Feature cards and highlights |
| Platform | Platform description section |
| Testimonials | User testimonial cards |
| Stats | Statistics display |
| Footer | Footer layout and links |

## Animation System

Subtle animations are used to enhance the user experience:
- Transition-based hover effects
- Scroll-triggered animations
- Transform animations for interactive elements

Example:
```css
.animate {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate.in-view {
    opacity: 1;
    transform: translateY(0);
}
```

## Responsive Design

The site adapts to different screen sizes with media queries:

| Breakpoint | Target Devices |
|------------|---------------|
| Default    | Mobile-first base styles |
| 576px+     | Large phones/small tablets |
| 768px+     | Tablets/small laptops |
| 992px+     | Laptops/desktops |

Example:
```css
@media (max-width: 768px) {
    .header .container {
        flex-direction: row;
        flex-wrap: wrap;
    }
    
    /* Additional responsive styles */
}
```

## Utility Classes

Several utility classes are available:

| Class | Purpose |
|-------|---------|
| `.btn` | Primary button style |
| `.btn-outline` | Secondary button style |
| `.highlight` | Text highlight with primary color |
| `.learn-more` | Learn more link style |

## Integration with Auth Styles

The main styles work in conjunction with the auth-specific styles in `/auth/styles/auth.css`. The auth styles follow the same design principles and use the same CSS variables for consistency.

## Best Practices

When modifying the CSS:
1. Use the existing CSS variables for colors and effects
2. Maintain the responsive design approach
3. Follow the established naming conventions
4. Keep related styles grouped together
5. Minimize use of !important (avoid if possible)
6. Use comments to explain complex styling decisions
