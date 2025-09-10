import React, { useState } from 'react'
import ToolCard from '../components/ToolCard'
import EmailChecker from '../tools/EmailChecker'
import IPChecker from '../tools/IPChecker'
import AudioChecker from '../tools/AudioChecker'

export default function Dashboard(){
  const [tool, setTool] = useState('email') // default

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <ToolCard title="Email Checker" desc="Validate email & reputation" onClick={() => setTool('email')} />
        <ToolCard title="IP Checker" desc="IP geolocation & reputation" onClick={() => setTool('ip')} />
        <ToolCard title="Audio Checker" desc="Upload audio for deepfake detection" onClick={() => setTool('audio')} />
      </div>

      <div className="mt-8 bg-transparent">
        {tool === 'email' && <EmailChecker />}
        {tool === 'ip' && <IPChecker />}
        {tool === 'audio' && <AudioChecker />}
      </div>
    </div>
  )
}
