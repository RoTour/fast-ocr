# Testing Strategy

This project follows **Test-Driven Development (TDD)** principles. When implementing any feature, tests **MUST be written BEFORE** the actual implementation code.

### TDD Workflow

1. **Write a failing test** that defines the expected behavior.
2. **Verify the test fails** (RED phase).
3. **Write the minimum implementation code** to make the test pass.
4. **Verify the test passes** (GREEN phase).
5. **Refactor** the code while ensuring tests still pass.
6. Repeat for each new feature or behavior.

---

## Test Structure for Use Cases

Every **UseCase** must have a corresponding test file following this structure:

```typescript
// Import the UseCase and necessary types
import { MyUseCase } from './MyUseCase';
import type { Input, Output } from './MyUseCase';

describe('MyUseCase', () => {
  // Setup test dependencies with stubs
  const findByIdStub = vi.fn();
  const doSomethingStub = vi.fn();

  // Test successful execution
  it('should return success when all conditions are met', async () => {
    // Arrange
    const data = { /* test input data */ };
    doSomethingStub.mockResolvedValue({ /* expected result */ });

    // Act
    const useCase = MyUseCase({ someRepository: findByIdStub, someService: doSomethingStub });
    const result = await useCase.execute(data);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ /* expected result */ });
    expect(doSomethingStub).toHaveBeenCalledWith(data);
  });

  // Test error scenarios
  it('should return error when required data is missing', async () => {
    // Arrange
    const data = { /* invalid data */ };
    
    // Act
    const useCase = MyUseCase({ someRepository: findByIdStub, someService: doSomethingStub });
    const result = await useCase.execute(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.status).toBe(400);
    expect(result.message).toBe('Expected error message');
  });
});
```

---

## Required Test Cases

For each **UseCase**, you **MUST** include tests for:

1. **Success path** – Expected behavior when everything works.
2. **Error paths** – For each possible error condition.
3. **Edge cases** – Special conditions that might occur.
4. **Dependency interaction** – Verify correct interaction with dependencies.

---

## Testing Dependencies

- All dependencies (repositories, services) **must be stubbed** to simulate behavior.
- Verify that dependencies are called with the correct parameters.
- Test different return values from dependencies.

---

## Test Strategy Implementation

### Step 1: Write Test First

Begin by writing a failing test that defines the expected behavior:

```typescript
it('should return user profile when valid ID is provided', async () => {
  // Arrange
  const findByIdStub = vi.fn().mockResolvedValue({ id: 'user-123', name: 'Test User' });
  const getProfileDataStub = vi.fn().mockResolvedValue({ bio: 'Test bio' });

  // Act
  const useCase = GetUserProfileUseCase({ userRepository: findByIdStub, profileService: getProfileDataStub });
  const result = await useCase.execute({ userId: 'user-123' });

  // Assert
  expect(result.isSuccess).toBe(true);
  expect(result.status).toBe(200);
  expect(result.data).toEqual({ user: { id: 'user-123', name: 'Test User' }, profileData: { bio: 'Test bio' } });
  expect(findByIdStub).toHaveBeenCalledWith('user-123');
  expect(getProfileDataStub).toHaveBeenCalledWith('user-123');
});
```

---

### Step 2: Verify Test Fails

Run the test and confirm it **fails** because the implementation **doesn't exist yet**.

---

### Step 3: Implement Minimum Code

Write the minimum code needed to **make the test pass**:

```typescript
export const GetUserProfileUseCase: UseCase<Input, Output> = ({ userRepository, profileService }) => {
  return {
    execute: async ({ userId }) => {
      const user = await userRepository(userId);
      const profileData = await profileService(userId);
      return UseCaseResponseBuilder.success(200, { user, profileData });
    }
  };
};
```

---

### Step 4: Verify Test Passes

Run the test again and confirm it **passes**.

---

### Step 5: Refactor

Improve the code while ensuring tests still **pass**:

```typescript
export const GetUserProfileUseCase: UseCase<Input, Output> = ({ userRepository, profileService }) => {
  return {
    execute: async ({ userId }) => {
      if (!userId) {
        return UseCaseResponseBuilder.error(400, 'User ID is required');
      }

      try {
        const user = await userRepository(userId);
        if (!user) {
          return UseCaseResponseBuilder.error(404, 'User not found');
        }

        const profileData = await profileService(userId);
        return UseCaseResponseBuilder.success(200, { user, profileData });
      } catch (error) {
        return UseCaseResponseBuilder.error(500, error.message);
      }
    }
  };
};
```

---

### Step 6: Add More Tests

Add tests for **error conditions** and **edge cases**:

```typescript
it('should return error when user is not found', async () => {
  // Arrange
  const findByIdStub = vi.fn().mockResolvedValue(null);
  const getProfileDataStub = vi.fn();

  // Act
  const useCase = GetUserProfileUseCase({ userRepository: findByIdStub, profileService: getProfileDataStub });
  const result = await useCase.execute({ userId: 'invalid-id' });

  // Assert
  expect(result.isSuccess).toBe(false);
  expect(result.status).toBe(404);
  expect(result.message).toBe('User not found');
});
```

---

## Important Notes

1. **Never skip tests** – All functionality must be tested.
2. **Always write tests first** – This ensures your code is testable.
3. **Verify stubs are called correctly** – Ensures dependencies are used properly.
4. **Test all paths** – Success, error, and edge cases.
5. **Keep tests simple and focused** – Each test should verify one thing.
6. **Use descriptive test names** – Names should describe what the test verifies.
7. **Stub all external dependencies** – Tests should be isolated.

---

### Summary of Changes:

✅ **Dependencies are now functions instead of whole objects.**  
✅ **Updated all examples to reflect this approach.**  
✅ **Ensured stubs are used for all test cases.**

This structure **keeps the UseCases simple, testable, and properly isolated**. Let me know if you'd like any further refinements! 🚀