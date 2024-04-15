import * as React from 'react'
import { Box, RadioGroup, RadioGroupProps, Radio, Stack, Text } from '@chakra-ui/react'

export type RadioButtonProps = Omit<RadioGroupProps, 'children'> & {}

const RadioButton: React.FC<RadioButtonProps> = ({ ...others }) => {
  return (
    <>
      <Box>
        <Text>Select Path Type:</Text>
        <RadioGroup {...others}>
          <Stack direction="row">
            <Radio value="linear">Linear</Radio>
            <Radio value="spline">Spline</Radio>
            <Radio value="linearWithAngle">Linear with angle</Radio>
            <Radio value="splineWithAngle">Spline with angle</Radio>
          </Stack>
        </RadioGroup>
      </Box>
    </>
  )
}

export default RadioButton
