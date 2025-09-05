import { useCallback, useEffect, useState } from '@lynx-js/react'
import type { AppState, BlockedApp, SherlockPuzzle, AppScreen } from './types'
import { getRandomPuzzle } from './data/puzzles'
import {
  getBlockedApps,
  getAppSettings,
  getUserStats,
  shouldResetDailyUsage,
  resetDailyUsage,
  markDailyReset,
  canAttemptPuzzle
} from './utils/storage'
import './App.css'

// Sample apps for demonstration
const SAMPLE_APPS: BlockedApp[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    packageName: 'com.instagram.android',
    icon: '📷',
    isBlocked: false,
    timeLimit: 60, // 1 hour
    timeUsed: 0,
    lastAccessed: null
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    packageName: 'com.zhiliaoapp.musically',
    icon: '🎵',
    isBlocked: false,
    timeLimit: 30, // 30 minutes
    timeUsed: 0,
    lastAccessed: null
  },
  {
    id: 'twitter',
    name: 'Twitter',
    packageName: 'com.twitter.android',
    icon: '🐦',
    isBlocked: false,
    timeLimit: 45, // 45 minutes
    timeUsed: 0,
    lastAccessed: null
  },
  {
    id: 'youtube',
    name: 'YouTube',
    packageName: 'com.google.android.youtube',
    icon: '📺',
    isBlocked: false,
    timeLimit: 120, // 2 hours
    timeUsed: 0,
    lastAccessed: null
  },
  {
    id: 'facebook',
    name: 'Facebook',
    packageName: 'com.facebook.katana',
    icon: '📘',
    isBlocked: false,
    timeLimit: 60, // 1 hour
    timeUsed: 0,
    lastAccessed: null
  }
]

export function App() {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'home',
    selectedApp: null,
    currentPuzzle: null,
    isLoading: false,
    error: null
  })

  const [apps, setApps] = useState<BlockedApp[]>([])
  const [stats, setStats] = useState(getUserStats())
  const [settings, setSettings] = useState(getAppSettings())

  // Initialize app data
  useEffect(() => {
    const initializeApp = () => {
      // Check if daily reset is needed
      if (shouldResetDailyUsage()) {
        resetDailyUsage()
        markDailyReset()
      }

      // Load or initialize apps
      const storedApps = getBlockedApps()
      if (storedApps.length === 0) {
        setApps(SAMPLE_APPS)
      } else {
        setApps(storedApps)
      }

      setStats(getUserStats())
      setSettings(getAppSettings())
    }

    initializeApp()
  }, [])

  const navigateToScreen = useCallback((screen: AppScreen, selectedApp?: BlockedApp) => {
    setAppState(prev => ({
      ...prev,
      currentScreen: screen,
      selectedApp: selectedApp || null,
      error: null
    }))
  }, [])

  const requestAppAccess = useCallback((app: BlockedApp) => {
    if (!app.isBlocked) {
      // App is not blocked, allow access
      navigateToScreen('home')
      return
    }

    if (!settings.requirePuzzleForAccess) {
      // Puzzles not required, allow access
      navigateToScreen('home')
      return
    }

    if (!canAttemptPuzzle()) {
      setAppState(prev => ({
        ...prev,
        error: 'You have reached your daily puzzle attempt limit. Try again tomorrow.'
      }))
      return
    }

    // Generate puzzle for app access
    const puzzle = getRandomPuzzle(settings.puzzleDifficulty === 'mixed' ? undefined : settings.puzzleDifficulty)
    setAppState(prev => ({
      ...prev,
      currentScreen: 'puzzle',
      selectedApp: app,
      currentPuzzle: puzzle,
      error: null
    }))
  }, [settings, navigateToScreen])

  const renderHomeScreen = () => (
    <view className="screen home-screen">
      <view className="header">
        <text className="app-title">🔍 Sherlocked</text>
        <text className="app-subtitle">Digital Detective</text>
      </view>

      <view className="stats-summary">
        <view className="stat-item">
          <text className="stat-number">{stats.totalPuzzlesSolved}</text>
          <text className="stat-label">Puzzles Solved</text>
        </view>
        <view className="stat-item">
          <text className="stat-number">{stats.currentStreak}</text>
          <text className="stat-label">Current Streak</text>
        </view>
        <view className="stat-item">
          <text className="stat-number">{Math.round((stats.correctAnswers / Math.max(stats.totalPuzzlesSolved, 1)) * 100)}%</text>
          <text className="stat-label">Success Rate</text>
        </view>
      </view>

      <view className="blocked-apps-preview">
        <text className="section-title">Blocked Apps</text>
        <view className="apps-grid">
          {apps.filter(app => app.isBlocked).slice(0, 4).map(app => (
            <view key={app.id} className="app-card blocked" bindtap={() => requestAppAccess(app)}>
              <text className="app-icon">{app.icon}</text>
              <text className="app-name">{app.name}</text>
              <text className="app-status">🔒 Blocked</text>
            </view>
          ))}
        </view>
        {apps.filter(app => app.isBlocked).length === 0 && (
          <text className="empty-state">No apps are currently blocked</text>
        )}
      </view>

      <view className="navigation">
        <view className="nav-button" bindtap={() => navigateToScreen('apps')}>
          <text className="nav-icon">📱</text>
          <text className="nav-label">Manage Apps</text>
        </view>
        <view className="nav-button" bindtap={() => navigateToScreen('stats')}>
          <text className="nav-icon">📊</text>
          <text className="nav-label">Statistics</text>
        </view>
        <view className="nav-button" bindtap={() => navigateToScreen('settings')}>
          <text className="nav-icon">⚙️</text>
          <text className="nav-label">Settings</text>
        </view>
      </view>

      {appState.error && (
        <view className="error-message">
          <text className="error-text">{appState.error}</text>
        </view>
      )}
    </view>
  )

  const renderAppsScreen = () => (
    <view className="screen apps-screen">
      <view className="header">
        <view className="back-button" bindtap={() => navigateToScreen('home')}>
          <text>← Back</text>
        </view>
        <text className="screen-title">Manage Apps</text>
      </view>

      <view className="apps-list">
        {apps.map(app => (
          <view key={app.id} className="app-item">
            <view className="app-info">
              <text className="app-icon">{app.icon}</text>
              <view className="app-details">
                <text className="app-name">{app.name}</text>
                <text className="app-limit">Limit: {app.timeLimit} min/day</text>
                <text className="app-usage">Used: {app.timeUsed} min today</text>
              </view>
            </view>
            <view className="app-controls">
              <text className={`block-status ${app.isBlocked ? 'blocked' : 'allowed'}`}>
                {app.isBlocked ? '🔒 Blocked' : '✅ Allowed'}
              </text>
            </view>
          </view>
        ))}
      </view>
    </view>
  )

  const renderStatsScreen = () => (
    <view className="screen stats-screen">
      <view className="header">
        <view className="back-button" bindtap={() => navigateToScreen('home')}>
          <text>← Back</text>
        </view>
        <text className="screen-title">Statistics</text>
      </view>

      <view className="stats-grid">
        <view className="stat-card">
          <text className="stat-title">Total Puzzles</text>
          <text className="stat-value">{stats.totalPuzzlesSolved}</text>
        </view>
        <view className="stat-card">
          <text className="stat-title">Correct Answers</text>
          <text className="stat-value">{stats.correctAnswers}</text>
        </view>
        <view className="stat-card">
          <text className="stat-title">Success Rate</text>
          <text className="stat-value">{Math.round((stats.correctAnswers / Math.max(stats.totalPuzzlesSolved, 1)) * 100)}%</text>
        </view>
        <view className="stat-card">
          <text className="stat-title">Current Streak</text>
          <text className="stat-value">{stats.currentStreak}</text>
        </view>
        <view className="stat-card">
          <text className="stat-title">Longest Streak</text>
          <text className="stat-value">{stats.longestStreak}</text>
        </view>
        <view className="stat-card">
          <text className="stat-title">Avg. Solve Time</text>
          <text className="stat-value">{Math.round(stats.averageTimeToSolve)}s</text>
        </view>
      </view>
    </view>
  )

  const renderSettingsScreen = () => (
    <view className="screen settings-screen">
      <view className="header">
        <view className="back-button" bindtap={() => navigateToScreen('home')}>
          <text>← Back</text>
        </view>
        <text className="screen-title">Settings</text>
      </view>

      <view className="settings-list">
        <view className="setting-item">
          <text className="setting-label">Puzzle Difficulty</text>
          <text className="setting-value">{settings.puzzleDifficulty}</text>
        </view>
        <view className="setting-item">
          <text className="setting-label">Require Puzzle for Access</text>
          <text className="setting-value">{settings.requirePuzzleForAccess ? 'Yes' : 'No'}</text>
        </view>
        <view className="setting-item">
          <text className="setting-label">Max Daily Attempts</text>
          <text className="setting-value">{settings.maxDailyAttempts}</text>
        </view>
        <view className="setting-item">
          <text className="setting-label">Theme</text>
          <text className="setting-value">{settings.themeMode}</text>
        </view>
      </view>
    </view>
  )

  const renderCurrentScreen = () => {
    switch (appState.currentScreen) {
      case 'home':
        return renderHomeScreen()
      case 'apps':
        return renderAppsScreen()
      case 'stats':
        return renderStatsScreen()
      case 'settings':
        return renderSettingsScreen()
      default:
        return renderHomeScreen()
    }
  }

  return (
    <view className="app-container">
      {renderCurrentScreen()}
    </view>
  )
}
