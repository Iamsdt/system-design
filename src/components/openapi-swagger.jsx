import { useState } from "react"
import { FileText, Code2, Play, CheckCircle, Zap, ExternalLink, Book } from "lucide-react"

export default function OpenAPISwagger() {
  const [selectedTab, setSelectedTab] = useState("spec")
  const [selectedApproach, setSelectedApproach] = useState("contractFirst")

  const approaches = {
    contractFirst: {
      name: "Contract-First (Spec-Driven)",
      icon: <FileText className="w-6 h-6" />,
      description: "Write OpenAPI spec first, then generate server stubs and client SDKs",
      workflow: [
        "Define API spec in OpenAPI YAML/JSON",
        "Review spec with stakeholders",
        "Generate server code stubs",
        "Implement business logic",
        "Generate client SDKs",
        "Generate interactive docs"
      ],
      pros: [
        "Design before implementation",
        "Cross-team agreement on contract",
        "Early client development (mocked)",
        "Consistent code generation",
        "Forces good API design thinking"
      ],
      cons: [
        "Initial learning curve",
        "Spec can drift from implementation",
        "Requires discipline to update spec",
        "Generated code might not match idioms"
      ],
      bestFor: [
        "Public APIs with multiple consumers",
        "Microservices teams working in parallel",
        "Enterprise with governance requirements",
        "When clients need SDKs in multiple languages"
      ]
    },
    codeFirst: {
      name: "Code-First (Implementation-Driven)",
      icon: <Code2 className="w-6 h-6" />,
      description: "Write API code with annotations, generate OpenAPI spec automatically",
      workflow: [
        "Implement API endpoints",
        "Add annotations/decorators",
        "Generate spec from code",
        "Review generated spec",
        "Publish spec + docs",
        "Generate client SDKs (optional)"
      ],
      pros: [
        "Faster initial development",
        "Spec always matches implementation",
        "No separate spec maintenance",
        "Familiar to developers",
        "Less context switching"
      ],
      cons: [
        "Design happens implicitly",
        "Harder to get early feedback",
        "Generated spec may not be ideal",
        "Clients can't start until code exists",
        "Less governance"
      ],
      bestFor: [
        "Internal microservices",
        "Rapid prototyping",
        "Small teams owning client and server",
        "When implementation is straightforward"
      ]
    }
  }

  const openAPIExample = `openapi: 3.0.0
info:
  title: E-Commerce API
  version: 1.0.0
  description: API for managing orders and products
  contact:
    email: api@example.com

servers:
  - url: https://api.example.com/v1
    description: Production
  - url: https://staging-api.example.com/v1
    description: Staging

paths:
  /products:
    get:
      summary: List products
      tags:
        - Products
      parameters:
        - name: category
          in: query
          schema:
            type: string
        - name: page
          in: query
          schema:
            type: integer
            default: 1
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Product'
                  pagination:
                    $ref: '#/components/schemas/Pagination'

  /products/{productId}:
    get:
      summary: Get product by ID
      tags:
        - Products
      parameters:
        - name: productId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Product found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'
        '404':
          description: Product not found

  /orders:
    post:
      summary: Create order
      tags:
        - Orders
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateOrder'
      responses:
        '201':
          description: Order created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '400':
          description: Invalid request
        '401':
          description: Unauthorized

components:
  schemas:
    Product:
      type: object
      required:
        - id
        - name
        - price
      properties:
        id:
          type: string
          example: "prod_123"
        name:
          type: string
          example: "Wireless Mouse"
        price:
          type: number
          format: float
          example: 29.99
        stock:
          type: integer
          example: 150
    
    CreateOrder:
      type: object
      required:
        - items
      properties:
        items:
          type: array
          items:
            type: object
            properties:
              productId:
                type: string
              quantity:
                type: integer
    
    Order:
      type: object
      properties:
        id:
          type: string
        status:
          type: string
          enum: [pending, paid, shipped]
        total:
          type: number
        createdAt:
          type: string
          format: date-time
    
    Pagination:
      type: object
      properties:
        page:
          type: integer
        totalPages:
          type: integer
        totalItems:
          type: integer

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT`

  const codeAnnotationExample = {
    fastapi: `# Python - FastAPI
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI(
    title="E-Commerce API",
    version="1.0.0",
    description="API for managing orders"
)

class Product(BaseModel):
    """Product model"""
    id: str
    name: str
    price: float
    stock: int = 0
    
    class Config:
        schema_extra = {
            "example": {
                "id": "prod_123",
                "name": "Wireless Mouse",
                "price": 29.99,
                "stock": 150
            }
        }

@app.get(
    "/products",
    response_model=List[Product],
    summary="List all products",
    tags=["Products"]
)
async def list_products(
    category: str = None,
    page: int = 1
):
    """
    Retrieve a list of products.
    
    - **category**: Filter by category (optional)
    - **page**: Page number for pagination
    """
    # Implementation
    return []

# OpenAPI spec auto-generated at /docs and /redoc`,

    springBoot: `// Java - Spring Boot
import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.media.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
@Tag(name = "Products", description = "Product management")
public class ProductController {
    
    @GetMapping
    @Operation(
        summary = "List products",
        description = "Retrieve a paginated list of products"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Successful response",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ProductList.class)
            )
        )
    })
    public ProductList listProducts(
        @Parameter(description = "Filter by category")
        @RequestParam(required = false) String category,
        
        @Parameter(description = "Page number")
        @RequestParam(defaultValue = "1") int page
    ) {
        // Implementation
        return new ProductList();
    }
}

// OpenAPI spec auto-generated at /v3/api-docs`,

    nestjs: `// TypeScript - NestJS
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  
  @Get()
  @ApiOperation({ summary: 'List products' })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by category'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'List of products',
    type: [ProductDto]
  })
  async listProducts(
    @Query('category') category?: string,
    @Query('page') page: number = 1
  ): Promise<ProductDto[]> {
    // Implementation
    return [];
  }
}

// OpenAPI spec auto-generated at /api-docs`
  }

  const generationTools = [
    {
      name: "Server Code Generation",
      icon: <Code2 className="w-5 h-5 text-blue-600" />,
      description: "Generate server stubs from OpenAPI spec",
      tools: [
        { name: "OpenAPI Generator", langs: "Node.js, Python, Java, Go, C#, Ruby, PHP..." },
        { name: "Swagger Codegen", langs: "40+ languages and frameworks" },
        { name: "oapi-codegen", langs: "Go (idiomatic)" }
      ]
    },
    {
      name: "Client SDK Generation",
      icon: <Zap className="w-5 h-5 text-purple-600" />,
      description: "Generate type-safe client libraries",
      tools: [
        { name: "openapi-typescript", langs: "TypeScript types + fetch client" },
        { name: "swagger-codegen", langs: "JavaScript, TypeScript, Kotlin, Swift" },
        { name: "autorest", langs: "C#, Python, TypeScript (Microsoft)" }
      ]
    },
    {
      name: "Documentation",
      icon: <Book className="w-5 h-5 text-green-600" />,
      description: "Interactive API documentation",
      tools: [
        { name: "Swagger UI", langs: "Interactive docs with try-it-out" },
        { name: "ReDoc", langs: "Clean, responsive API reference" },
        { name: "Stoplight Elements", langs: "Modern embeddable docs" }
      ]
    },
    {
      name: "Testing & Mocking",
      icon: <Play className="w-5 h-5 text-orange-600" />,
      description: "Generate tests and mock servers",
      tools: [
        { name: "Prism", langs: "Mock server from OpenAPI spec" },
        { name: "Dredd", langs: "API testing against spec" },
        { name: "Portman", langs: "Generate Postman collections" }
      ]
    }
  ]

  const currentApproach = approaches[selectedApproach]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-3xl font-bold text-slate-900 mb-3">
          OpenAPI & Swagger
        </h3>
        <p className="text-lg text-slate-600 mb-6">
          Standardized API specifications for documentation, code generation, and contract-first development.
        </p>
      </div>

      {/* What is OpenAPI? */}
      <div className=" from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
        <div className="flex items-start gap-4 mb-6">
          <FileText className="w-8 h-8 text-blue-600 mt-1" />
          <div>
            <h4 className="text-2xl font-bold text-slate-900 mb-3">What is OpenAPI?</h4>
            <p className="text-slate-700 mb-4">
              OpenAPI (formerly Swagger) is a <span className="font-bold">specification format</span> for describing REST APIs. It's like a blueprint of your API that both humans and machines can read.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h5 className="font-bold text-slate-900 mb-2 text-sm">For Humans</h5>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Interactive documentation</li>
                  <li>• API design review</li>
                  <li>• Onboarding new developers</li>
                  <li>• Understanding endpoints</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h5 className="font-bold text-slate-900 mb-2 text-sm">For Machines</h5>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Generate client SDKs</li>
                  <li>• Generate server code</li>
                  <li>• Validate requests/responses</li>
                  <li>• Mock servers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-100 rounded-lg p-4">
          <div className="text-sm text-blue-900">
            <span className="font-bold">History:</span> Swagger was created in 2011. In 2015, it was donated to the OpenAPI Initiative and renamed OpenAPI Specification (OAS). "Swagger" now refers to the tooling (Swagger UI, Swagger Editor, Swagger Codegen), while "OpenAPI" is the spec itself.
          </div>
        </div>
      </div>

      {/* Contract-First vs Code-First */}
      <div>
        <h4 className="text-2xl font-bold text-slate-900 mb-6">Development Approaches</h4>
        
        {/* Approach Selector */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {Object.entries(approaches).map(([key, approach]) => (
            <button
              key={key}
              onClick={() => setSelectedApproach(key)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                selectedApproach === key
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className={`mb-3 ${selectedApproach === key ? "text-blue-600" : "text-slate-600"}`}>
                {approach.icon}
              </div>
              <div className="font-bold text-lg text-slate-900 mb-2">{approach.name}</div>
              <div className="text-sm text-slate-600">{approach.description}</div>
            </button>
          ))}
        </div>

        {/* Approach Details */}
        <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
          <h5 className="text-xl font-bold text-slate-900 mb-6">{currentApproach.name}</h5>

          {/* Workflow */}
          <div className=" from-slate-50 to-slate-100 rounded-lg p-6 mb-6">
            <h6 className="font-bold text-slate-900 mb-4">Typical Workflow</h6>
            <div className="space-y-3">
              {currentApproach.workflow.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="text-sm text-slate-700">{step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h6 className="font-bold text-slate-900">Pros</h6>
              </div>
              <ul className="space-y-2">
                {currentApproach.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-green-600 mt-0.5">+</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-red-600">⚠</span>
                <h6 className="font-bold text-slate-900">Cons</h6>
              </div>
              <ul className="space-y-2">
                {currentApproach.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-red-600 mt-0.5">-</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Best For */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h6 className="font-bold text-slate-900 mb-3 text-sm">Best For</h6>
            <div className="grid md:grid-cols-2 gap-3">
              {currentApproach.bestFor.map((use, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{use}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* OpenAPI Specification Example */}
      <div className=" from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
        <h4 className="text-2xl font-bold text-slate-900 mb-6">OpenAPI Specification Example</h4>
        <p className="text-slate-600 mb-6">
          A complete OpenAPI 3.0 spec for an e-commerce API. This single file describes all endpoints, request/response schemas, authentication, and more.
        </p>

        <div className="bg-white rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-purple-700">openapi.yaml</div>
            <div className="text-xs text-slate-500">OpenAPI 3.0.0</div>
          </div>
          <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-96">
            <code>{openAPIExample}</code>
          </pre>
        </div>

        <div className="bg-purple-100 rounded-lg p-4 mt-4">
          <div className="text-sm text-purple-900">
            <span className="font-bold">Key Features:</span> <code className="bg-purple-200 px-2 py-0.5 rounded">$ref</code> for reusable schemas, 
            <code className="bg-purple-200 px-2 py-0.5 rounded mx-1">tags</code> for grouping endpoints, 
            <code className="bg-purple-200 px-2 py-0.5 rounded mr-1">securitySchemes</code> for authentication, 
            <code className="bg-purple-200 px-2 py-0.5 rounded">examples</code> for documentation, 
            <code className="bg-purple-200 px-2 py-0.5 rounded ml-1">enum</code> for validation
          </div>
        </div>
      </div>

      {/* Code Annotations (Code-First) */}
      <div className="bg-white rounded-2xl p-8 border-2 border-slate-200">
        <h4 className="text-2xl font-bold text-slate-900 mb-6">Code Annotations (Code-First)</h4>
        <p className="text-slate-600 mb-6">
          Add annotations to your API code, and the framework generates the OpenAPI spec automatically.
        </p>

        {/* Tab Selector */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setSelectedTab("fastapi")}
            className={`px-4 py-2 font-semibold transition-colors ${
              selectedTab === "fastapi"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Python (FastAPI)
          </button>
          <button
            onClick={() => setSelectedTab("springBoot")}
            className={`px-4 py-2 font-semibold transition-colors ${
              selectedTab === "springBoot"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Java (Spring Boot)
          </button>
          <button
            onClick={() => setSelectedTab("nestjs")}
            className={`px-4 py-2 font-semibold transition-colors ${
              selectedTab === "nestjs"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            TypeScript (NestJS)
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-4">
          <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
            <code>{codeAnnotationExample[selectedTab]}</code>
          </pre>
        </div>
      </div>

      {/* Code Generation Tools */}
      <div className=" from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-slate-200">
        <h4 className="text-2xl font-bold text-slate-900 mb-6">Code Generation & Tooling</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          {generationTools.map((category, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                {category.icon}
                <div>
                  <h5 className="font-bold text-slate-900">{category.name}</h5>
                  <p className="text-xs text-slate-600">{category.description}</p>
                </div>
              </div>
              <div className="space-y-3">
                {category.tools.map((tool, toolIdx) => (
                  <div key={toolIdx} className="border-l-2 border-blue-200 pl-3">
                    <div className="font-semibold text-slate-900 text-sm">{tool.name}</div>
                    <div className="text-xs text-slate-600">{tool.langs}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CLI Examples */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4">CLI Commands</h4>
        
        <div className="space-y-4">
          <div>
            <div className="text-sm font-semibold text-slate-700 mb-2">Generate TypeScript client</div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded">
{`npx openapi-typescript openapi.yaml -o schema.ts

// Usage
import { paths } from './schema'

type GetProducts = paths['/products']['get']
type ProductResponse = GetProducts['responses']['200']['content']['application/json']`}
            </pre>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-700 mb-2">Generate Python server (FastAPI)</div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded">
{`openapi-generator generate \\
  -i openapi.yaml \\
  -g python-fastapi \\
  -o ./server

cd server && pip install -r requirements.txt && uvicorn main:app`}
            </pre>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-700 mb-2">Run mock server with Prism</div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded">
{`npx @stoplight/prism-cli mock openapi.yaml

# Returns example responses from spec
curl http://localhost:4010/products/prod_123`}
            </pre>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-700 mb-2">Validate spec</div>
            <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded">
{`npx @redocly/cli lint openapi.yaml

# Or validate online
https://editor.swagger.io`}
            </pre>
          </div>
        </div>
      </div>

      {/* Real-World Examples */}
      <div className=" from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-green-600" />
          Real-World OpenAPI Specs
        </h4>
        
        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="font-bold text-slate-900 mb-1">Stripe API</div>
            <div className="text-sm text-slate-600 mb-2">650+ endpoints, comprehensive payment API</div>
            <a href="https://github.com/stripe/openapi" className="text-xs text-blue-600 hover:underline">
              github.com/stripe/openapi
            </a>
          </div>

          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="font-bold text-slate-900 mb-1">GitHub API</div>
            <div className="text-sm text-slate-600 mb-2">Complete OpenAPI 3.1 spec for GitHub REST API</div>
            <a href="https://github.com/github/rest-api-description" className="text-xs text-blue-600 hover:underline">
              github.com/github/rest-api-description
            </a>
          </div>

          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="font-bold text-slate-900 mb-1">Kubernetes API</div>
            <div className="text-sm text-slate-600 mb-2">OpenAPI spec for Kubernetes API server</div>
            <a href="https://github.com/kubernetes/kubernetes" className="text-xs text-blue-600 hover:underline">
              Available at /openapi/v2 or /openapi/v3
            </a>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className=" from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4">Best Practices</h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div className="text-sm text-slate-700">
                <span className="font-semibold">Use $ref for reuse:</span> Define schemas once in components, reference everywhere
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div className="text-sm text-slate-700">
                <span className="font-semibold">Include examples:</span> Makes documentation clearer, enables mock servers
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div className="text-sm text-slate-700">
                <span className="font-semibold">Validate responses:</span> Use validation middleware to ensure API matches spec
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div className="text-sm text-slate-700">
                <span className="font-semibold">Version your spec:</span> Commit to git, treat like code
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div className="text-sm text-slate-700">
                <span className="font-semibold">Use tags for grouping:</span> Organize endpoints logically (Products, Orders, Users)
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div className="text-sm text-slate-700">
                <span className="font-semibold">Document security:</span> Specify auth schemes (OAuth2, API keys, JWT)
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div className="text-sm text-slate-700">
                <span className="font-semibold">Use enums for constraints:</span> Better validation and autocompletion
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
              <div className="text-sm text-slate-700">
                <span className="font-semibold">CI/CD integration:</span> Auto-generate docs and clients on commit
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Tips */}
      <div className=" from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>💡</span>
          Interview Tips
        </h4>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "What's the difference between Swagger and OpenAPI?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "OpenAPI is the specification format (JSON/YAML) for describing REST APIs. Swagger was the original name, donated to the OpenAPI Initiative in 2015. Now 'Swagger' refers to the tools—Swagger UI for interactive docs, Swagger Editor for authoring specs, Swagger Codegen for code generation. So OpenAPI is the spec, Swagger is the tooling."
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "Contract-first or code-first?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "Contract-first for public APIs with multiple consumers—design spec upfront, get alignment, then generate stubs and clients. Code-first for internal microservices or rapid prototyping—implement quickly with annotations, spec always matches code. At my last company, we used contract-first for our customer-facing API (needed stable contracts) but code-first for internal services (moved faster)."
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">
              Q: "How do you keep spec in sync with implementation?"
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-semibold">A:</span> "Code-first approach: spec auto-generated, always in sync. Contract-first: use validation middleware to compare runtime behavior against spec (libraries like express-openapi-validator). Add CI check: run requests against spec, fail build if mismatch. Better yet, generate server stubs from spec—if you implement the interfaces, you're guaranteed to match. Also treat spec as code: version control, code review, require spec update in PR."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
