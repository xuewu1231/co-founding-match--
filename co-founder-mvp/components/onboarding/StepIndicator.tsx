interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <div key={stepNumber} className="flex items-center">
            {/* 步骤圆圈 */}
            <div
              className={`
                flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all
                ${isCompleted ? 'bg-brand-primary text-white' : ''}
                ${isActive ? 'bg-brand-primary text-white ring-4 ring-brand-light' : ''}
                ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
              `}
            >
              {isCompleted ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                stepNumber
              )}
            </div>

            {/* 连接线（最后一个步骤不显示）*/}
            {stepNumber < totalSteps && (
              <div
                className={`
                  w-16 h-1 mx-2 transition-all
                  ${stepNumber < currentStep ? 'bg-brand-primary' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
