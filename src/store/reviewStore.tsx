import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

interface ReviewState {
  dailyReviewCount: number;
  lastReviewDate: string;
  totalReviews: number;
}

type ReviewAction =
  | { type: 'COMPLETE_REVIEW'; payload: { wordId: string } }
  | { type: 'LOAD_STATE'; payload: ReviewState };

const getInitialState = (): ReviewState => ({
  dailyReviewCount: 0,
  lastReviewDate: '',
  totalReviews: 0,
});

function reviewReducer(state: ReviewState, action: ReviewAction): ReviewState {
  switch (action.type) {
    case 'COMPLETE_REVIEW':
      return {
        ...state,
        dailyReviewCount: state.dailyReviewCount + 1,
        lastReviewDate: new Date().toISOString().split('T')[0],
        totalReviews: state.totalReviews + 1,
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

interface ReviewContextValue {
  state: ReviewState;
  dispatch: React.Dispatch<ReviewAction>;
}

const ReviewContext = createContext<ReviewContextValue | null>(null);

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reviewReducer, getInitialState());

  return (
    <ReviewContext.Provider value={{ state, dispatch }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) throw new Error('useReview must be used within ReviewProvider');
  return context;
};
