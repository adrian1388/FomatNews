import React from 'react'
import { Container, Label } from "../../components/common"
import { ScrollView, TouchableOpacity } from "react-native"
import { useIntl } from "react-intl"
import { withTheme } from 'styled-components'

export const Categories = withTheme(({theme, setCategory, category, setLoading}) => {
  const intl = useIntl()
  const categoryIds = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']

  return (
    <ScrollView horizontal contentContainerStyle={{}}>
      {categoryIds.map((cat, index) => (
        <TouchableOpacity
          key={index + cat}
          onPress={() => {
            setLoading(true)
            if (cat === category) {
              setCategory(null) 
            } else {
              setCategory(cat)
            }
          }}
          style={{padding: 10}}
        >
          <Label color={cat === category ? theme.globalGreen : theme.globalBlue}>{intl.formatMessage({id: cat})}</Label>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
})