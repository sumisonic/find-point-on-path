import * as React from 'react'
import { Box, BoxProps, Button, ButtonProps } from '@chakra-ui/react'

export type GenerateButtonProps = BoxProps & Pick<ButtonProps, 'onClick'> & {}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, ...others }) => {
  return (
    <>
      <Box {...others}>
        <Button colorScheme="teal" onClick={onClick}>
          Regenerate Points
        </Button>
      </Box>
    </>
  )
}

export default GenerateButton
