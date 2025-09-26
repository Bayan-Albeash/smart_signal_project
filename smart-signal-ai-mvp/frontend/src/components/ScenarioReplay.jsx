import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react'

const ScenarioReplay = ({ scenarios, onScenarioChange, isPlaying, onPlayPause }) => {
  const [currentTime, setCurrentTime] = useState(0)
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0] || null)
  const [isReplaying, setIsReplaying] = useState(false)

  useEffect(() => {
    let interval
    if (isReplaying && selectedScenario) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1
          if (newTime >= selectedScenario.duration) {
            setIsReplaying(false)
            return selectedScenario.duration
          }
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isReplaying, selectedScenario])

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario)
    setCurrentTime(0)
    setIsReplaying(false)
    onScenarioChange(scenario)
  }

  const handlePlayPause = () => {
    setIsReplaying(!isReplaying)
    onPlayPause(!isReplaying)
  }

  const handleReset = () => {
    setCurrentTime(0)
    setIsReplaying(false)
    onPlayPause(false)
  }

  const handleSkipForward = () => {
    setCurrentTime(prev => Math.min(prev + 10, selectedScenario?.duration || 0))
  }

  const handleSkipBack = () => {
    setCurrentTime(prev => Math.max(prev - 10, 0))
  }

  const progress = selectedScenario ? (currentTime / selectedScenario.duration) * 100 : 0

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className="mr-2">🎬</span>
        إعادة تشغيل السيناريوهات
      </h2>

      {/* Scenario Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          اختر السيناريو:
        </label>
        <div className="grid grid-cols-1 gap-2">
          {scenarios.map((scenario) => (
            <motion.button
              key={scenario.id}
              onClick={() => handleScenarioSelect(scenario)}
              className={`p-3 rounded-lg border text-right transition-all ${
                selectedScenario?.id === scenario.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-medium">{scenario.name}</div>
              <div className="text-sm text-gray-600">{scenario.description}</div>
              <div className="text-xs text-gray-500 mt-1">
                المدة: {scenario.duration} ثانية
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Playback Controls */}
      {selectedScenario && (
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>التقدم</span>
              <span>{currentTime}s / {selectedScenario.duration}s</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center space-x-4 space-x-reverse">
            <motion.button
              onClick={handleSkipBack}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SkipBack className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={handlePlayPause}
              className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isReplaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </motion.button>

            <motion.button
              onClick={handleReset}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={handleSkipForward}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SkipForward className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Current Status */}
          <AnimatePresence>
            {isReplaying && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  جاري تشغيل السيناريو...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Scenario Timeline */}
      {selectedScenario && (
        <div className="mt-6">
          <h3 className="font-medium mb-3">جدول زمني للسيناريو</h3>
          <div className="space-y-2">
            {selectedScenario.timeline?.map((event, index) => (
              <motion.div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  currentTime >= event.time
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{event.description}</div>
                  </div>
                  <div className="text-xs text-gray-500">{event.time}s</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ScenarioReplay
