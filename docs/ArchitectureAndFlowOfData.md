This application is following Hexagonal Architecture, Domain Driven Design, and TDD principles.
TDD principles are especially important to apply since we need this app to be built with AI, and this is the best way to the AI models to know how much progress they've made.

## How is this app designed
- `.` : Find the config files, .env
- `./docs/ai/*` Where you will find a ton of informations about this codebase and how you should interact with it
- `./prisma` : prisma files for managing the database schema, migrations etc
- `./static` : static files served by the application
- `./src` : Source files of the app
- `./src/pages` : routing folder with the page view and server files. These files should be kept very simple and call components from the available modules
- `./src/modules` (alias: `@module`) : Where we define subdomains and bounded context
	- `./src/modules/contexts/[context1]` : Define every entity that is related to [context1]
	- `./src/modules/domains/[domain1]` : In this folder, define the differents features or use cases for the app
		- `./src/modules/domains/[domain1]/[usecase]/[usecase].ts`: Where we place our use cases (see ./docs/ai/[[Building UseCases]])
		- `./src/modules/domains/[domain1]/[usecase]/[usecase].test.ts` Where we have to extensively test our use case (see ./docs/ai/[[Testing Strategy]])
		- `(...)/[usecase]/models` : Where we store the different models specific to the current use case, such as DTOs
		- `(...)/[usecase]/services` : Services used by the use case
		- `(...)/[usecase]/repositories` : Repositories used by the use case. (see ./docs/ai/[[Components specifications]] - Repositories)
		- `(...)/[usecase]/views` : Views specific to the use case. Each view should have a ViewModel associated, and a Test file testing the view model
		- `(...)/[usecase]/gateways` : Ways that the client can interact with the server. This folder typically includes a router, an Interface defining the gateway, and an implementation using the router. (see ./docs/ai/[[Components specifications]] - Gateways)
- `./src/lib`(alias: `$lib`)
	- `.`
