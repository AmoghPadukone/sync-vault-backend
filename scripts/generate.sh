#!/bin/bash
set -e

# ========== Paths ==========
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$ROOT_DIR/src"
RELATIVE_PATH() {
  echo "${1/$ROOT_DIR\/src\//}"
}

if [ -z "$1" ]; then
  printf "❌  Please provide a module name (e.g. cloudProvider)\n"
  exit 1
fi

NAME=$1
LOWER_NAME="$(echo $NAME | awk '{print tolower(substr($0,0,1)) substr($0,2)}')"
CAMEL_NAME="$LOWER_NAME"
PASCAL_NAME="$(echo $NAME | awk '{print toupper(substr($0,0,1)) substr($0,2)}')"

# ========== File Paths ==========
ROUTE_FILE="$SRC_DIR/routes/${CAMEL_NAME}.routes.ts"
SERVICE_FILE="$SRC_DIR/services/${CAMEL_NAME}.service.ts"
CONTROLLER_FILE="$SRC_DIR/controllers/${CAMEL_NAME}.controller.ts"
TEST_FILE="$ROOT_DIR/tests/${CAMEL_NAME}.test.ts"
DTO_FILE="$SRC_DIR/types/dto/${CAMEL_NAME}.dto.ts"
SWAGGER_SCHEMA_FILE="$SRC_DIR/swagger/schema/${CAMEL_NAME}.schema.ts"

# ========== Dry Run ==========
printf "\033[1;34m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m\n"
printf "🔍 \033[1mDry Run Preview:\033[0m\n"
printf "📄 To create:\n"
printf "  📌 routes/       →  \033[32m%s\033[0m\n" "$(RELATIVE_PATH "$ROUTE_FILE")"
printf "  📌 services/     →  \033[32m%s\033[0m\n" "$(RELATIVE_PATH "$SERVICE_FILE")"
printf "  📌 controllers/  →  \033[32m%s\033[0m\n" "$(RELATIVE_PATH "$CONTROLLER_FILE")"
printf "  📌 tests/        →  \033[32mtests/%s.test.ts\033[0m\n" "$CAMEL_NAME"
printf "  📌 types/dto/    →  \033[32m%s\033[0m\n" "$(RELATIVE_PATH "$DTO_FILE")"
printf "  📌 swagger/schema/ →  \033[32m%s\033[0m\n" "$(RELATIVE_PATH "$SWAGGER_SCHEMA_FILE")"
printf "\033[1;34m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m\n\n"

read -p "⚡ Proceed with generation? (y/n): " confirm
if [ "$confirm" != "y" ]; then
  printf "\n❌ \033[1;31mAborted.\033[0m\n"
  exit 0
fi

# ========== File Creator ==========
create_file() {
  local path=$1
  local content=$2

  if [ -f "$path" ]; then
    printf "⚠️  \033[33m%s\033[0m already exists. Overwrite? (y/n): " "$(RELATIVE_PATH "$path")"
    read -r choice
    if [ "$choice" != "y" ]; then
      printf "⏭️  Skipped \033[2m%s\033[0m\n" "$(RELATIVE_PATH "$path")"
      return
    fi
  fi

  mkdir -p "$(dirname "$path")"
  echo "$content" > "$path"
  printf "✅ Created \033[32m%s\033[0m\n" "$(RELATIVE_PATH "$path")"
}

# ========== File Templates ==========
ROUTE_TEMPLATE="import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { ${CAMEL_NAME}Controller } from '../controllers/${CAMEL_NAME}.controller';
// import { validate } from '../middlewares/validate';
// import { Create${PASCAL_NAME}Schema } from '../types/dto/${CAMEL_NAME}.dto';

const router = Router();

/**
 * @swagger
 * /api/${CAMEL_NAME}/example:
 *   get:
 *     summary: Example route for ${PASCAL_NAME}
 *     tags: [${PASCAL_NAME}]
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/example', asyncHandler(${CAMEL_NAME}Controller.example));

export default router;
"

SERVICE_TEMPLATE="import prisma from '../db/client';

export const ${PASCAL_NAME}Service = {
  // Add service methods here
};
"

CONTROLLER_TEMPLATE="import { Request, Response } from 'express';

export const ${CAMEL_NAME}Controller = {
  example: async (req: Request, res: Response) => {
    res.json({ message: 'Hello from ${PASCAL_NAME}Controller' });
  },
};
"

TEST_TEMPLATE="import request from 'supertest';
import app from '../src/app';

describe('${PASCAL_NAME} API', () => {
  it('should respond to /example', async () => {
    const res = await request(app).get('/api/${CAMEL_NAME}/example');
    expect(res.statusCode).toBe(200);
  });
});
"

DTO_TEMPLATE="import { z } from 'zod';

export const Create${PASCAL_NAME}Schema = z.object({
  name: z.string(),
  isActive: z.boolean().optional(),
});

export type Create${PASCAL_NAME}Dto = z.infer<typeof Create${PASCAL_NAME}Schema>;
"

SWAGGER_SCHEMA_TEMPLATE="export const ${CAMEL_NAME}Schemas = {
  Create${PASCAL_NAME}Dto: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', example: 'Sample ${PASCAL_NAME}' },
      isActive: { type: 'boolean', example: true },
    },
  },
};
"

# ========== Create All Files ==========
create_file "$ROUTE_FILE" "$ROUTE_TEMPLATE"
create_file "$SERVICE_FILE" "$SERVICE_TEMPLATE"
create_file "$CONTROLLER_FILE" "$CONTROLLER_TEMPLATE"
create_file "$TEST_FILE" "$TEST_TEMPLATE"
create_file "$DTO_FILE" "$DTO_TEMPLATE"
create_file "$SWAGGER_SCHEMA_FILE" "$SWAGGER_SCHEMA_TEMPLATE"

printf "\n🎉 \033[1;32mDone!\033[0m Your module \033[1m%s\033[0m has been generated.\n" "$PASCAL_NAME"
printf "📘 \033[36mSwagger schemas auto-loaded via\033[0m \033[1m/src/swagger/schema/index.ts\033[0m\n"
