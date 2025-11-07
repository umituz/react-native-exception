# @umituz/react-native-exception

Exception handling and error tracking for React Native apps.

## Features

- Centralized exception handling
- Error boundary component
- Exception store with Zustand
- Error categorization and severity levels
- Exception reporting utilities

## Installation

```bash
npm install @umituz/react-native-exception
```

## Peer Dependencies

- `react` >= 18.2.0
- `react-native` >= 0.74.0
- `zustand` >= 5.0.2

## Usage

### Error Boundary

```typescript
import { ErrorBoundary } from '@umituz/react-native-exception';

<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

### Exception Service

```typescript
import { exceptionService } from '@umituz/react-native-exception';

try {
  // Your code
} catch (error) {
  exceptionService.handleException(
    error,
    'error',
    'business-logic',
    { userId: '123' }
  );
}
```

### Exception Store

```typescript
import { useExceptionStore } from '@umituz/react-native-exception';

const { exceptions, lastError } = useExceptionStore();
```

## License

MIT





