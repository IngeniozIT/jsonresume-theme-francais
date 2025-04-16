# jsonresume-theme-francais

A French-themed JSON Resume theme with a clean and professional design. This theme is designed to work with the [JSON Resume](https://jsonresume.org/) format and provides a beautiful, French-styled layout for your CV.

## Features

- Clean and professional French design
- Support for all standard JSON Resume fields
- Responsive layout
- Easy to customize
- Docker support for easy development and testing

## Installation

### As an npm module

```bash
npm install jsonresume-theme-francais
```

### For development

```bash
git clone https://github.com/yourusername/jsonresume-theme-francais.git
cd jsonresume-theme-francais
npm install
```

## Usage

### Using the npm module

1. Install the theme globally:
```bash
npm install -g jsonresume-theme-francais
```

2. Use it with the resume-cli:
```bash
resume export --theme francais your-resume.html
```

### Using Docker

1. Start the Docker container:
```bash
docker-compose up -d
```

2. Generate your resume:
```bash
# Using default filenames
docker-compose exec theme node dist/index.js

# Using custom filenames
docker-compose exec theme node dist/index.js custom-input.json custom-output.html
```

The generated HTML file will be available in the `output` directory.

## Development

### Project Structure

```
jsonresume-theme-francais/
├── src/                # Source files
│   ├── index.js       # Main theme file
│   └── template.hbs   # Handlebars template
├── input/             # Input directory for resume.json files
├── output/            # Output directory for generated HTML
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── package.json       # npm package configuration
```

### Building the Theme

```bash
npm run build
```

This will:
1. Clean the dist directory
2. Copy all source files
3. Compile the JavaScript with Babel

### Testing

To test the theme with your resume:

1. Place your resume.json in the input directory
2. Start the Docker container
3. Generate the HTML
4. Check the output in the output directory

## Customization

The theme can be customized by modifying the Handlebars template in `src/template.hbs`. The template uses standard JSON Resume fields and can be extended with custom fields as needed.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- [JSON Resume](https://jsonresume.org/) for the resume format
- [Handlebars](https://handlebarsjs.com/) for the templating engine

