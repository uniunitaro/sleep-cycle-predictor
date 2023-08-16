import { FC } from 'react'
import { Box, keyframes } from '../chakra'

const AwesomeLoader: FC = () => {
  const keyframe = keyframes`
    0%{transform:rotate(0deg);}
    100%{transform:rotate(360deg);}
  `
  const grdAiguilleAnimation = `${keyframe} 2s linear infinite`
  const ptAiguilleAnimation = `${keyframe} 12s linear infinite`
  const color = 'brand.500'

  return (
    <Box
      borderRadius="70px"
      border="3px solid"
      borderColor={color}
      position="absolute"
      top="50%"
      left="50%"
      ml="-50px"
      mt="-50px"
      display="block"
      transform="scale(0.5, 0.5)"
      width="120px"
      height="120px"
      _after={{
        content: '""',
        position: 'absolute',
        backgroundColor: color,
        top: '13px',
        left: '48%',
        height: '50px',
        width: '4px',
        borderRadius: '5px',
        transformOrigin: '50% 97%',
        animation: grdAiguilleAnimation,
      }}
      _before={{
        content: '""',
        position: 'absolute',
        backgroundColor: color,
        top: '24px',
        left: '48%',
        height: '40px',
        width: '4px',
        borderRadius: '5px',
        transformOrigin: '50% 94%',
        animation: ptAiguilleAnimation,
      }}
    />
  )
}

export default AwesomeLoader
