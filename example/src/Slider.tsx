import * as React from 'react'
import {
  Box,
  Text,
  Slider as SliderBase,
  SliderProps as SliderBaseProps,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Checkbox,
  HStack,
} from '@chakra-ui/react'

export type SliderProps = SliderBaseProps & {}

const Slider: React.FC<SliderProps> = ({ value, onChange, ...sliderProps }) => {
  const [autoSlide, setAutoSlide] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(value ?? 0)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    if (autoSlide) {
      intervalRef.current = setInterval(() => {
        setInternalValue((prevValue) => (prevValue >= 1 ? 0 : prevValue + 0.002))
      }, 10)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoSlide])

  React.useEffect(() => {
    if (autoSlide && onChange) {
      onChange(internalValue)
    }
  }, [internalValue, autoSlide, onChange])

  const handleSliderChange = (newValue: number) => {
    if (!autoSlide) {
      setInternalValue(newValue)
      if (onChange) {
        onChange(newValue)
      }
    }
  }

  return (
    <Box>
      <HStack spacing={10}>
        <Checkbox isChecked={autoSlide} onChange={(e) => setAutoSlide(e.target.checked)}>
          Animate Slider
        </Checkbox>
        <Text>Adjust t value: {autoSlide ? internalValue.toFixed(3) : value?.toFixed(3)}</Text>
      </HStack>
      <SliderBase
        aria-label="slider-ex-1"
        min={0}
        max={1}
        step={0.001}
        value={autoSlide ? internalValue : value}
        onChange={handleSliderChange}
        isDisabled={autoSlide}
        {...sliderProps}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </SliderBase>
    </Box>
  )
}

export default Slider
