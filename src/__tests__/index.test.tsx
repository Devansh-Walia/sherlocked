// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import '@testing-library/jest-dom'
import { expect, test, vi } from 'vitest'
import { render, getQueriesForElement } from '@lynx-js/react/testing-library'

import { App } from '../App'

test('App', async () => {
  render(<App />)

  const {
    findByText,
  } = getQueriesForElement(elementTree.root!)

  // Test that the main title is rendered
  const titleElement = await findByText('🔍 Sherlocked')
  expect(titleElement).toBeInTheDocument()

  // Test that the subtitle is rendered
  const subtitleElement = await findByText('Digital Detective')
  expect(subtitleElement).toBeInTheDocument()

  // Test that navigation elements are present
  const manageAppsElement = await findByText('Manage Apps')
  expect(manageAppsElement).toBeInTheDocument()

  const statisticsElement = await findByText('Statistics')
  expect(statisticsElement).toBeInTheDocument()

  const settingsElement = await findByText('Settings')
  expect(settingsElement).toBeInTheDocument()
})
