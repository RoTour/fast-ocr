## Overview
This document explains how we build our components and how they interact with each other in our hexagonal architecture.

## Repositories
Repositories encapsulate data access logic needed by use cases. They provide an abstraction layer between domain logic and data storage.

### Structure
A repository folder typically contains:

1. An interface file defining all required methods
2. One or more implementation files for different data sources

### Interface Definition
Interface files define the contract that implementations must follow:

```typescript
// IListCampaignsRepository.ts
import type { CampaignCompletion } from '../models/CampaignCompletion';
import type { CampaignInfos } from '../models/CampaignInfos';

export type ListCampaignsJoinedByUser = (userId?: string) => Promise<CampaignInfos[]>;
export type GetCompletionByCampaign = (campaigns: CampaignInfos[], userId?: string) => Promise<CampaignCompletion[]>;
```

**Naming Convention:** `I[UseCaseName]Repository.ts`

### Implementation
Implementations may implement all or part of the interface:

```typescript
import * as IListCampaignRepository from './IListCampaignsRepository';

type InMemoryListCampaignsRepository = {
    getCompletionByCampaign: IListCampaignRepository.GetCompletionByCampaign;
};

export const InMemoryListCampaignsRepository = (
    inMemoryData: AttemptsByCampaign[] // Dependencies specific to this implementation
): InMemoryListCampaignsRepository => {
    return {
        getCompletionByCampaign: // Implementation
    };
};
```

**Naming Convention:** `[Source][UseCaseName]Repository.ts`

## Gateways

Gateways provide interfaces for external communication, primarily for client-server interactions. They abstract communication protocols (often using tRPC in our applications).

### Interface Definition
Gateway interfaces define methods that often match use case dependencies:

```typescript
export type ILearningGateway = {
    createQuestion: (dto: CreateQuestionDto) => Promise<UseCaseResponse<Question>>;
    getUserQuestions: (userId: string) => Promise<Question[]>;
    saveQuestion: (question: Question) => Promise<void>;
};
```

**Naming Convention:** `I[UseCase]Gateway.ts`

### Implementations
We typically have two gateway implementations - one for client-side and one for server-side:

#### Client-side Implementation

```typescript
export const TRPCLearningGateways = (init?: TRPCClientInit): ILearningGateway => {
    const client = trpc(init);
    return {
        createQuestion: async (dto) => {
            return client.learning.createQuestion.mutate({ ...dto });
        },
        getUserQuestions: async (userId) => {
            return client.learning.getUserQuestions.query(userId);
        },
        saveQuestion: async (question) => {
            return client.learning.saveQuestion.mutate(question);
        }
    };
};
```

#### Server-side Implementation

```typescript
import { createContext } from '$lib/trpc/context';
import { createCaller } from '$lib/trpc/router';
import type { RequestEvent } from '@sveltejs/kit';
import type { ILearningGateway } from './ILearningGateways';
  
export const TRPCServerLearningGateway = (event: RequestEvent): ILearningGateway => {
    const buildCaller = async () => {
        return (createCaller(await createContext(event)));
    };
    
    return {
        createQuestion: async (dto) => {
            const caller = await buildCaller();
            return caller.learning.createQuestion({ ...dto });
        },
        getUserQuestions: async (userId) => {
            const caller = await buildCaller();
            return caller.learning.getUserQuestions(userId);
        },
        saveQuestion: async (question) => {
            const caller = await buildCaller();
            return caller.learning.saveQuestion(question);
        }
    };
};
```

**Naming Convention:** `[GatewayType](Server|Client)[UseCase]Gateway.ts`

Example: `TRPCClientLearningGateway.ts`