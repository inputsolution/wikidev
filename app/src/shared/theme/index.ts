import { createLightTheme, createDarkTheme } from '@fluentui/react-components'
import type { Theme } from '@fluentui/react-components'
import { wikiDevBrand } from './brand'

export const wikiDevLightTheme: Theme = createLightTheme(wikiDevBrand)
export const wikiDevDarkTheme: Theme = createDarkTheme(wikiDevBrand)
