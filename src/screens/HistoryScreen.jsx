import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import Header from '../global/Header'
import { Sliders } from 'lucide-react-native'

const History = () => {
  return (
    <View className="flex-1 bg-slate-100">
      <Header title="History" showBack={true} />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold">Filters</Text>
          <TouchableOpacity className="px-4 py-2 rounded-lg bg-violet-600 flex-row items-center">
            <Sliders size={16} color="#fff" />
            <Text className="ml-2 text-white">Advanced Filters</Text>
          </TouchableOpacity>
        </View>

        <View className="rounded-xl bg-white overflow-hidden">
          <View className="flex-row px-4 py-3 border-b border-slate-200 bg-slate-50">
            <Text className="flex-1 text-sm text-slate-500">AWB NUMBER</Text>
            <Text className="w-16 text-center text-sm text-slate-500">HUB ID</Text>
            <Text className="w-28 text-center text-sm text-slate-500">SCAN TYPE</Text>
            <Text className="flex-1 text-right text-sm text-slate-500">DATE & TIME</Text>
          </View>

          <View className="flex-row px-4 py-4 border-b border-slate-100 items-center">
            <Text className="flex-1 text-sm">DKTN4994051213</Text>
            <Text className="w-16 text-center text-sm">1</Text>
            <View className="w-28 items-center">
              <Text className="bg-slate-100 px-2 py-1 rounded-full text-xs">PICKUP_SCAN</Text>
            </View>
            <Text className="flex-1 text-right text-sm">Jun 10, 2026, 01:40 PM</Text>
          </View>

          <View className="px-4 py-3">
            <Text className="text-sm text-slate-500">Showing 1 to 1 of 1 results</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default History