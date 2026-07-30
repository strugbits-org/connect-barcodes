import { Module } from "@medusajs/framework/utils"
import QuoteModuleService from "./service"

export const QUOTE_MODULE = "quoteModuleService"

export default Module(QUOTE_MODULE, { service: QuoteModuleService })
