// Inspired by react-hot-toast library
import * as React from 'react';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

// const actionTypes = {
//   ADD_TOAST: 'ADD_TOAST',
//   UPDATE_TOAST: 'UPDATE_TOAST',
//   DISMISS_TOAST: 'DISMISS_TOAST',
//   REMOVE_TOAST: 'REMOVE_TOAST',
// };

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map();

// @ts-ignore allowlist-migration
const addToRemoveQueue = toastId => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t: any) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast: any) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t: any) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t: any) => t.id !== action.toastId),
      };
  }
};

// @ts-ignore allowlist-migration
const listeners = [];

let memoryState = { toasts: [] };

function dispatch(action: any) {
  memoryState = reducer(memoryState, action);
  // @ts-ignore allowlist-migration
  listeners.forEach((listener: any) => {
    listener(memoryState);
  });
}

function toast({ ...props }: any) {
  const id = genId();

  // @ts-ignore allowlist-migration
  const update = props =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      // @ts-ignore allowlist-migration
      onOpenChange: open => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      // @ts-ignore allowlist-migration
      const index = listeners.indexOf(setState);
      if (index > -1) {
        // @ts-ignore allowlist-migration
        listeners.splice(index, 1);
      }
    };
    // Subscribe once; re-subscribing on every state change duplicates listeners.
  }, []);

  return {
    ...state,
    toast,
    // @ts-ignore allowlist-migration
    dismiss: toastId => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

export { useToast, toast };
