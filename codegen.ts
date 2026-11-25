import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: './src/graphql/schema.graphql',
  documents: 'src/graphql/**/*.gql',
  generates: {
    'src/generated/__generated_graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-vue-apollo'
      ],
      config: {
        withCompositionFunctions: true,
        vueCompositionApiImportFrom: 'vue',
        dedupeFragments: true
      }
    }
  }
}

export default config
