'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  label?: string
  height?: string
}

interface State {
  hasError: boolean
  message: string
}

export default class ScanErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: this.props.height ?? '160px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#555',
          fontSize: '13px',
          gap: '6px',
        }}>
          <p>{this.props.label ?? 'Component'} failed to load.</p>
          {this.state.message && (
            <p style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#383838' }}>
              {this.state.message}
            </p>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
