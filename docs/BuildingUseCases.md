## Overview

UseCases are the core business logic components in our hexagonal architecture. Each UseCase represents a single application feature and follows a consistent pattern to ensure testability and maintainability.

## How to Implement a UseCase

1. **Define Input and Output Types**:    
    ```typescript
import {
	UseCaseResponseBuilder,
	type InputFactory,
	type OutputFactory,
	type UseCase
} from '$lib/interfaces/UseCase';

type Input = InputFactory<
  { 
	// Business data needed by the use case
	userId: string;
	someData: SomeType;
  },
  {
	// Dependencies (repositories, services)
	someRepository: SomeRepositoryInterface;
	someService: SomeServiceInterface;
  }
>;

type Output = OutputFactory<ResultType>;
```

2. **Implement the UseCase**:
```typescript
export const MyUseCase: UseCase<Input, Output> = (deps) => {
  // Extract dependencies
  const { someRepository, someService } = deps;
  
  return {
	execute: async ({ userId, someData }) => {
	  try {
		// Implement business logic
		const result = await someService.doSomething(someData);
		
		// Return success
		return UseCaseResponseBuilder.success(200, result);
	  } catch (error) {
		// Return error
		return UseCaseResponseBuilder.error(400, error.message);
	  }
	}
  };
};
```
## Key Principles
1. **Dependency Injection**: Dependencies are passed into the UseCase, not imported directly.
2. **Domain Logic**: Focus on business rules, not infrastructure details.
3. **Standard Responses**: Always use `UseCaseResponseBuilder` to return standardized responses.
    - Success: `UseCaseResponseBuilder.success(statusCode, data)`
    - Error: `UseCaseResponseBuilder.error(statusCode, message)`
4. **Separation of Concerns**:
    - The UseCase should only orchestrate the business logic
    - Data transformation should be handled by mappers
    - Data access should be handled by repositories
5. **Testing**: Ensure each UseCase has comprehensive tests that verify both success and error paths.

## Common Patterns
- **Validation**: Validate input data before processing
- **Authorization**: Verify user permissions if needed
- **Error Handling**: Always return standardized error responses
- **Transactions**: Use repositories for database operations
- **Mapping**: Transform data between domain and persistence models

## Example Use Case

```typescript

type Input = InputFactory<
{
	userId: string;
},
{
	findUserById: GetUserProfileRepository.FindUserById;
	getProfileData: GetUserProfileRepository.GetProfileData;
}
>;

type Output = OutputFactory<QuickActions>;
export const GetUserProfileUseCase: UseCase<Input, Output> = (deps) => {
  const { findUserById, getProfileData } = deps;
  
  return {
    execute: async ({ userId }) => {
      // Validate input
      if (!userId) return UseCaseResponseBuilder.error(400, 'User ID is required');
      
      try {
        const user = await findUserById(userId);
        
        if (!user) return UseCaseResponseBuilder.error(404, 'User not found');
        
        const profileData = await getProfileData(userId);
        
        return UseCaseResponseBuilder.success(200, { user, profileData });
      } catch (error) {
        return UseCaseResponseBuilder.error(500, error.message);
      }
    }
  };
};
```