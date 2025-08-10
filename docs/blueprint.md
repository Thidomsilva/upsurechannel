# **App Name**: CanalUpsure

## Core Features:

- Screenshot OCR: Extract betting information from uploaded screenshots using Google Cloud Vision OCR.
- Data Parsing & Normalization: Parse and normalize extracted OCR data to identify game details, odds, and stake information. Use an LLM tool to validate and fill the blank spaces for data normalization.
- Surebet Stake Calculation: Calculate optimal stakes for two-way surebets, with a provision for manual adjustments by the user.
- Telegram Publication: Publish formatted betting order messages to a specified Telegram channel with interactive buttons.
- Result Settlement: Enable users to select the winning bet after the game, automatically calculate profits, and publish the results on Telegram.
- History & Reporting: Maintain a comprehensive history of bets, audit trails, and generate detailed reports on accuracy, ROI, and profitability.
- User Authentication and Roles: Implement user authentication and role-based access control (admin, analyst, viewer).

## Style Guidelines:

- Primary color: A vibrant, saturated purple (#A020F0) evoking a sense of excitement and modernity, without leaning too heavily into sports clichés. In HSL this color is approximately (283, 83%, 53%).
- Background color: A very light gray (#F0F0F5), derived from the purple hue but significantly desaturated, providing a neutral backdrop that ensures readability and focuses attention on the betting information. In HSL this color is approximately (267, 20%, 95%).
- Accent color: A contrasting teal (#008080) drawn from the analogous side of the color wheel, serving to highlight interactive elements and key data points. In HSL this color is approximately (180, 100%, 25%).
- Headline font: 'Space Grotesk' (sans-serif) for headlines and short labels; suitable for headlines and short amounts of body text; if longer text is anticipated, use this for headlines and 'Inter' for body.
- Body font: 'Inter' (sans-serif) for longer blocks of text.
- Code font: 'Source Code Pro' (monospace) for displaying any code snippets.
- Use a clean, modern layout with clear visual hierarchy to present betting information effectively.