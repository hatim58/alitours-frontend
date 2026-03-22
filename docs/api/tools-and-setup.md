# API Documentation Tools & Setup

## Recommended Tools for Automatic API Documentation

### 1. **Swagger/OpenAPI (Recommended)**

**Why Choose Swagger:**
- Industry standard for API documentation
- Interactive documentation with "Try it out" functionality
- Automatic code generation for multiple languages
- Excellent ecosystem and community support

**Setup for Node.js/Express:**

```bash
npm install swagger-jsdoc swagger-ui-express
```

```javascript
// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ali Tours & Travels API',
      version: '1.0.0',
      description: 'Travel management API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API files
};

const specs = swaggerJSDoc(options);

module.exports = { specs, swaggerUi };
```

**In your main app file:**
```javascript
const { specs, swaggerUi } = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

### 2. **Postman Collections**

**Benefits:**
- Easy API testing
- Team collaboration
- Environment management
- Automated testing

**Setup:**
```bash
# Install Newman for CLI testing
npm install -g newman

# Run collection
newman run Ali-Tours-API.postman_collection.json -e production.postman_environment.json
```

### 3. **Insomnia**

**Features:**
- Beautiful interface
- GraphQL support
- Plugin ecosystem
- Team workspaces

### 4. **API Blueprint + Aglio**

**For Markdown-based documentation:**
```bash
npm install -g aglio

# Generate HTML docs
aglio -i api.apib -o docs.html
```

### 5. **Redoc**

**For beautiful OpenAPI documentation:**
```bash
npm install redoc-cli

# Generate static docs
redoc-cli build openapi.yaml --output docs.html
```

## Documentation Automation Setup

### 1. **GitHub Actions for Auto-Documentation**

Create `.github/workflows/docs.yml`:

```yaml
name: Generate API Documentation

on:
  push:
    branches: [main]
    paths: ['docs/api/**', 'src/routes/**']

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install -g redoc-cli
        
      - name: Generate documentation
        run: redoc-cli build docs/api/openapi.yaml --output public/api-docs.html
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

### 2. **Automated OpenAPI Generation**

**Using swagger-jsdoc with JSDoc comments:**

```javascript
/**
 * @swagger
 * /packages:
 *   get:
 *     summary: Get all tour packages
 *     tags: [Packages]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of packages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Package'
 */
router.get('/packages', async (req, res) => {
  // Implementation
});
```

### 3. **TypeScript Integration**

**Generate types from OpenAPI:**
```bash
npm install @openapitools/openapi-generator-cli

# Generate TypeScript types
openapi-generator-cli generate -i docs/api/openapi.yaml -g typescript-fetch -o src/api/generated
```

## Documentation Hosting Options

### 1. **GitHub Pages (Free)**
- Host static documentation
- Automatic deployment via GitHub Actions
- Custom domain support

### 2. **Netlify (Free tier available)**
- Easy deployment
- Form handling
- Serverless functions

### 3. **Vercel (Free tier available)**
- Excellent performance
- Easy integration with Git
- Automatic deployments

### 4. **GitBook**
- Beautiful documentation sites
- Collaborative editing
- Integration with Git repositories

### 5. **Notion (Alternative)**
- Easy to use
- Collaborative
- Good for internal documentation

## Documentation Best Practices

### 1. **Structure Organization**

```
docs/
├── api/
│   ├── README.md              # Main API overview
│   ├── authentication.md     # Auth endpoints
│   ├── packages.md           # Package endpoints
│   ├── bookings.md           # Booking endpoints
│   ├── openapi.yaml          # OpenAPI specification
│   └── tools-and-setup.md    # This file
├── guides/
│   ├── getting-started.md    # Quick start guide
│   ├── authentication.md    # Auth guide
│   └── examples.md          # Code examples
└── postman/
    ├── collections/
    └── environments/
```

### 2. **Content Guidelines**

- **Clear descriptions**: Explain what each endpoint does
- **Real examples**: Use actual data from your system
- **Error scenarios**: Document all possible error responses
- **Rate limits**: Clearly state limitations
- **Authentication**: Explain auth requirements
- **Versioning**: Document API version changes

### 3. **Interactive Examples**

```javascript
// Include runnable code examples
const response = await fetch('/api/packages/shimla-explorer', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
});

const package = await response.json();
console.log(package.data.name); // "Shimla Winter Wonderland"
```

### 4. **SDK Documentation**

Provide SDKs for popular languages:

**JavaScript/TypeScript:**
```bash
npm install @ali-tours/api-client
```

**Python:**
```bash
pip install ali-tours-api
```

**PHP:**
```bash
composer require ali-tours/api-client
```

## Maintenance Workflow

### 1. **Documentation Updates**

1. Update OpenAPI spec when adding/changing endpoints
2. Regenerate documentation automatically
3. Update code examples
4. Test all examples
5. Deploy updated docs

### 2. **Version Management**

```yaml
# In openapi.yaml
info:
  version: 1.2.0
  
# Document breaking changes
x-changelog:
  - version: 1.2.0
    date: 2024-05-20
    changes:
      - Added new booking status 'processing'
      - Deprecated old payment endpoint
```

### 3. **Testing Documentation**

```javascript
// Test that examples in docs actually work
describe('Documentation Examples', () => {
  it('should match actual API responses', async () => {
    const response = await request(app)
      .get('/api/packages/shimla-explorer')
      .expect(200);
    
    // Verify response matches documented schema
    expect(response.body).toMatchSchema(packageSchema);
  });
});
```

## Monitoring and Analytics

### 1. **Documentation Usage**

Track which endpoints are most viewed:
- Google Analytics on documentation site
- API usage statistics
- User feedback collection

### 2. **API Health Monitoring**

```javascript
// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION,
    uptime: process.uptime()
  });
});
```

## Quick Start Commands

### Generate Documentation

```bash
# Install tools
npm install -g redoc-cli swagger-codegen

# Generate HTML documentation
redoc-cli build docs/api/openapi.yaml --output api-docs.html

# Generate Postman collection from OpenAPI
swagger-codegen generate -i docs/api/openapi.yaml -l postman-collection -o postman/

# Validate OpenAPI spec
swagger-codegen validate -i docs/api/openapi.yaml
```

### Local Development

```bash
# Start documentation server
npx @redocly/openapi-cli preview-docs docs/api/openapi.yaml

# Serve Swagger UI locally
npx swagger-ui-serve docs/api/openapi.yaml
```

## Integration with Development Workflow

### 1. **Pre-commit Hooks**

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run validate-docs && npm run generate-docs"
    }
  },
  "scripts": {
    "validate-docs": "swagger-codegen validate -i docs/api/openapi.yaml",
    "generate-docs": "redoc-cli build docs/api/openapi.yaml --output public/api-docs.html"
  }
}
```

### 2. **CI/CD Integration**

```yaml
# .github/workflows/api-docs.yml
name: API Documentation

on:
  push:
    paths: ['docs/api/**']

jobs:
  deploy-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Generate and deploy docs
        run: |
          npm install -g redoc-cli
          redoc-cli build docs/api/openapi.yaml --output docs.html
          # Deploy to your hosting service
```

This comprehensive documentation system will grow with your API and provide excellent developer experience for anyone integrating with your travel management system!