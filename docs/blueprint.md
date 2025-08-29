# **App Name**: Roadmap Weaver

## Core Features:

- CSV Data Parsing: Parses the CSV file from the provided URL (https://docs.google.com/spreadsheets/d/e/2PACX-1vSXOTj_wxPP58ILt8SXHLMHojKflBVuUuQGJuouYTH1bdq8Ni4aFMlk0VUZSORKkaiXHyZfpmjkfcnj/pub?gid=825942922&single=true&output=csv) using PapaParse to extract roadmap data.
- Interactive Roadmap Visualization: Renders roadmap items in a clear visual structure showing their interdependencies, grouped by `Metodologia`.
- Tabular Roadmap View: Renders an alternate table view of the same roadmap items for users who prefer tabular navigation and presentation.
- Table Filtering: Provides the ability to filter the table view in real time.
- PDF Export: Exports the roadmap visualization to a PDF, recreating the hierarchical presentation.
- Dark/Light Mode: Dark/light mode toggle, for comfortable viewing under different lighting conditions.

## Style Guidelines:

- Primary color: Dark vivid purple (#9D17EB) to convey expertise and strategy. It is ideal as a standout element without being visually jarring, and to suggest precision and efficiency.
- Background color: Very light grayish purple (#F5F3FF), nearly white but with a trace of the primary to maintain design cohesion.
- Accent color: A dark orchid color (#7C3AED) to highlight interactive elements and important information, while providing sufficient contrast against the lighter background.
- Font: 'Plus Jakarta Sans' (sans-serif). Note: currently only Google Fonts are supported.
- The app mimics the layout and styling of shadcn/ui components where applicable.
- Smooth transitions and animations using Framer Motion for UI elements to enhance user experience.