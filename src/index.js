const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Function to fetch image and convert to base64
const fetchImageToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      const chunks = [];
      
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString('base64');
        const mimeType = response.headers['content-type'] || 'image/jpeg';
        resolve(`data:${mimeType};base64,${base64}`);
      });
      response.on('error', reject);
    }).on('error', reject);
  });
};

const formatDateDiff = (startDate, endDate) => {
  // Convertir en objets Date
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calcul des différences
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth() + 1;

  // Ajustement si les mois sont négatifs
  if (months < 0) {
    years--;
    months += 12;
  }

  let result = [];

  if (years > 0) {
    result.push(`${years} ${years === 1 ? 'an' : 'ans'}`);
  }

  if (months > 0) {
    result.push(`${months} ${months === 1 ? 'mois' : 'mois'}`);
  }

  return result.join(' ') || '0 mois';
}

// Read the template file
const template = Handlebars.compile(fs.readFileSync(path.join(__dirname, 'template.hbs'), 'utf8'));

const render = async (resume) => {
  // Register custom helpers
  Handlebars.registerHelper('formatDate', (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  });

  Handlebars.registerHelper('formatYearDate', (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.getFullYear();
  });

  Handlebars.registerHelper('formatSkills', (skills) => {
    if (!skills) return '';
    return skills.map(skill => skill.name).join(', ');
  });

  Handlebars.registerHelper('replace', (text, search, replacement) => {
    if (!text) return '';
    return text.replace(new RegExp(search, 'g'), replacement);
  });

  Handlebars.registerHelper('eq', (a, b) => {
    return a === b;
  });

  // Handle image if present
  if (resume.basics && resume.basics.image) {
    try {
      resume.basics.imageBase64 = await fetchImageToBase64(resume.basics.image);
    } catch (error) {
      console.error('Error fetching image:', error.message);
      resume.basics.imageBase64 = null;
    }
  }

  // Foreach work.highlights, if it contains "Skills :", add a new property "skills" with the value of the string after "Skills :", remove the highlight from the array, and split the skills by comma
  resume.work.forEach(work => {
    if (work.highlights && work.highlights.some(highlight => highlight.includes('Skills :'))) {
      work.skills = work.highlights.find(highlight => highlight.includes('Skills :')).split('Skills :')[1].split(',').map(skill => skill.trim());
      work.highlights = work.highlights.filter(highlight => !highlight.includes('Skills :'));
    }
    // compute the number of years and months of experience from start to end date (or now), and format it like so : "X ans X mois" or "X ans" or "X mois"
    const startDate = new Date(work.startDate);
    const endDate = work.endDate ? new Date(work.endDate) : new Date();
    work.experience = formatDateDiff(startDate, endDate);
  });

  resume.education.reverse();

  // Compile and render the template
  const html = template(resume);
  return html;
};

// If running from command line
if (require.main === module) {
  try {
    // Get input and output directories from environment variables
    const inputDir = process.env.INPUT_DIR || '/app/input';
    const outputDir = process.env.OUTPUT_DIR || '/app/output';
    
    // Get input and output filenames from command line arguments or use defaults
    const inputFile = process.argv[2] || 'resume.json';
    const outputFile = process.argv[3] || 'resume.html';
    
    const inputPath = path.join(inputDir, inputFile);
    const outputPath = path.join(outputDir, outputFile);
    
    console.log(`Reading from: ${inputPath}`);
    console.log(`Writing to: ${outputPath}`);
    
    const resumeJson = fs.readFileSync(inputPath, 'utf8');
    const resume = JSON.parse(resumeJson);
    render(resume).then(html => {
      fs.writeFileSync(outputPath, html);
      console.log(`Resume generated successfully: ${outputPath}`);
    }).catch(error => {
      console.error('Error:', error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = { render }; 