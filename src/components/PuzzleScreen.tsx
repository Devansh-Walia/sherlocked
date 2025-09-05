import { useCallback, useEffect, useState } from '@lynx-js/react'
import type { SherlockPuzzle, PuzzleAttempt } from '../types'
import {
    savePuzzleAttempt,
    updateUserStats,
    getUserStats,
    updateAppUsage
} from '../utils/storage'

interface PuzzleScreenProps {
    puzzle: SherlockPuzzle
    appName: string
    onSuccess: () => void
    onFailure: () => void
    onBack: () => void
}

export function PuzzleScreen({
    puzzle,
    appName,
    onSuccess,
    onFailure,
    onBack
}: PuzzleScreenProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [startTime] = useState(Date.now())
    const [timeElapsed, setTimeElapsed] = useState(0)
    const [showHint, setShowHint] = useState(false)
    const [showExplanation, setShowExplanation] = useState(false)

    // Update timer every second
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeElapsed(Math.floor((Date.now() - startTime) / 1000))
        }, 1000)

        return () => clearInterval(timer)
    }, [startTime])

    const handleAnswerSelect = useCallback((answerIndex: number) => {
        if (showResult) return
        setSelectedAnswer(answerIndex)
    }, [showResult])

    const handleSubmit = useCallback(() => {
        if (selectedAnswer === null || showResult) return

        const timeToSolve = Math.floor((Date.now() - startTime) / 1000)
        const correct = selectedAnswer === puzzle.correctAnswer

        setIsCorrect(correct)
        setShowResult(true)
        setShowExplanation(true)

        // Save puzzle attempt
        const attempt: PuzzleAttempt = {
            puzzleId: puzzle.id,
            selectedAnswer,
            isCorrect: correct,
            timestamp: new Date(),
            timeToSolve
        }

        savePuzzleAttempt(attempt)
        updateUserStats(correct, timeToSolve, puzzle.category)

        // Auto-proceed after showing result
        setTimeout(() => {
            if (correct) {
                onSuccess()
            } else {
                onFailure()
            }
        }, 3000)
    }, [selectedAnswer, showResult, startTime, puzzle, onSuccess, onFailure])

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return '#4caf50'
            case 'medium': return '#ff9800'
            case 'hard': return '#f44336'
            default: return '#d4af37'
        }
    }

    const getDifficultyIcon = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return '🟢'
            case 'medium': return '🟡'
            case 'hard': return '🔴'
            default: return '⭐'
        }
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'logic': return '🧠'
            case 'riddle': return '🤔'
            case 'deduction': return '🔍'
            case 'trivia': return '📚'
            default: return '❓'
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`
    }

    return (
        <view className="screen puzzle-screen">
            <view className="puzzle-header">
                <view className="puzzle-info">
                    <view className="back-button" bindtap={onBack}>
                        <text>← Back</text>
                    </view>
                    <text className="puzzle-title">🔍 Solve to Access</text>
                    <text className="puzzle-app-name">{appName}</text>
                </view>

                <view className="puzzle-meta">
                    <view className="puzzle-difficulty">
                        <text className="difficulty-icon">{getDifficultyIcon(puzzle.difficulty)}</text>
                        <text
                            className="difficulty-text"
                            style={{ color: getDifficultyColor(puzzle.difficulty) }}
                        >
                            {puzzle.difficulty.toUpperCase()}
                        </text>
                    </view>
                    <view className="puzzle-category">
                        <text className="category-icon">{getCategoryIcon(puzzle.category)}</text>
                        <text className="category-text">{puzzle.category.toUpperCase()}</text>
                    </view>
                    <view className="puzzle-timer">
                        <text className="timer-icon">⏱️</text>
                        <text className="timer-text">{formatTime(timeElapsed)}</text>
                    </view>
                </view>
            </view>

            <view className="puzzle-content">
                <view className="question-container">
                    <text className="question-text">{puzzle.question}</text>
                </view>

                <view className="answers-container">
                    {puzzle.options.map((option, index) => (
                        <view
                            key={index}
                            className={`answer-option ${selectedAnswer === index ? 'selected' : ''
                                } ${showResult
                                    ? index === puzzle.correctAnswer
                                        ? 'correct'
                                        : selectedAnswer === index
                                            ? 'incorrect'
                                            : 'disabled'
                                    : ''
                                }`}
                            bindtap={() => handleAnswerSelect(index)}
                        >
                            <text className="answer-letter">
                                {String.fromCharCode(65 + index)}
                            </text>
                            <text className="answer-text">{option}</text>
                            {showResult && index === puzzle.correctAnswer && (
                                <text className="answer-indicator">✓</text>
                            )}
                            {showResult && selectedAnswer === index && index !== puzzle.correctAnswer && (
                                <text className="answer-indicator">✗</text>
                            )}
                        </view>
                    ))}
                </view>

                {!showResult && (
                    <view className="puzzle-actions">
                        {puzzle.hint && (
                            <view
                                className="hint-button"
                                bindtap={() => setShowHint(!showHint)}
                            >
                                <text className="hint-button-text">
                                    {showHint ? '🙈 Hide Hint' : '💡 Show Hint'}
                                </text>
                            </view>
                        )}

                        <view
                            className={`submit-button ${selectedAnswer !== null ? 'enabled' : 'disabled'}`}
                            bindtap={handleSubmit}
                        >
                            <text className="submit-button-text">Submit Answer</text>
                        </view>
                    </view>
                )}

                {showHint && puzzle.hint && (
                    <view className="hint-container">
                        <text className="hint-title">💡 Hint:</text>
                        <text className="hint-text">{puzzle.hint}</text>
                    </view>
                )}

                {showResult && (
                    <view className="result-container">
                        <view className={`result-header ${isCorrect ? 'success' : 'failure'}`}>
                            <text className="result-icon">
                                {isCorrect ? '🎉' : '😔'}
                            </text>
                            <text className="result-title">
                                {isCorrect ? 'Correct!' : 'Incorrect'}
                            </text>
                            <text className="result-subtitle">
                                {isCorrect
                                    ? `Great job! You solved it in ${formatTime(Math.floor((Date.now() - startTime) / 1000))}`
                                    : 'Better luck next time!'
                                }
                            </text>
                        </view>

                        {showExplanation && puzzle.explanation && (
                            <view className="explanation-container">
                                <text className="explanation-title">📖 Explanation:</text>
                                <text className="explanation-text">{puzzle.explanation}</text>
                            </view>
                        )}

                        <view className="result-actions">
                            <text className="auto-close-text">
                                {isCorrect
                                    ? 'Granting access in a moment...'
                                    : 'Returning to home screen...'
                                }
                            </text>
                        </view>
                    </view>
                )}
            </view>

            {/* Stats Display */}
            <view className="puzzle-stats">
                <text className="stats-title">Your Progress</text>
                <view className="stats-row">
                    <view className="stat-item-small">
                        <text className="stat-number-small">{getUserStats().currentStreak}</text>
                        <text className="stat-label-small">Streak</text>
                    </view>
                    <view className="stat-item-small">
                        <text className="stat-number-small">
                            {Math.round((getUserStats().correctAnswers / Math.max(getUserStats().totalPuzzlesSolved, 1)) * 100)}%
                        </text>
                        <text className="stat-label-small">Success</text>
                    </view>
                    <view className="stat-item-small">
                        <text className="stat-number-small">{getUserStats().totalPuzzlesSolved}</text>
                        <text className="stat-label-small">Total</text>
                    </view>
                </view>
            </view>
        </view>
    )
}
