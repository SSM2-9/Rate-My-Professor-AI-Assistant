'use client'

import { useRouter } from 'next/navigation';
import { Box, Typography, Button, AppBar, Toolbar } from "@mui/material";
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  const handleClick_1 = () => {
    // Navigate to the /generate page
    router.push('/generate');
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'rgba(0, 0, 0)' }}>
        <Toolbar>
          <Link href="/" passHref>
            <Button>
              <Typography variant="h5" sx={{ fontFamily: 'Montserrat, sans-serif', color: 'rgb(255, 255, 255)'}} style={{ flexGrow: 1 }}>
                RateMyMentor @ HeadstarterAI
              </Typography>
            </Button>
          </Link>
        </Toolbar>
      </AppBar>

      <Box sx={{ 
        textAlign: 'center', 
        position: 'relative', 
        overflow: 'hidden', 
        height: 780, 
        backgroundColor: 'rgb(0,0,0)', 
      }}>
        <img
          src="/main.gif"
          alt="Background GIF"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            objectFit: 'cover',
            opacity: 0.4,
            zIndex: 1,  // Ensure the GIF is behind the content
          }}
        />
        <Box sx={{
          position: 'relative', 
          padding: 30, 
          zIndex: 2,  // Ensure the content is in front of the GIF
          color: 'white', // Ensure text color contrasts against the background
        }}>
          <Typography variant="h2" component="h1" gutterBottom className='bangers' sx={{ fontFamily: 'Montserrat, sans-serif' }}>
            Welcome to RateMyMentor @ HeadstarterAI
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
            Connecting mentees with top-rated HeadstarterAI mentors for an unparalleled learning experience.
          </Typography>
          <Link href="/generate" passHref>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                mr: 2,
                backgroundColor: 'rgb(0, 227, 178)',
                '&:hover': {
                  backgroundColor: 'rgba(142, 252, 228)',
                  transform: 'scale(1.05)',
                },
                color: 'rgba(0, 0, 0)',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
              }}
              onClick={handleClick_1}
            >
              Get Started
            </Button>
          </Link>
        </Box>
      </Box>
    </>
  );
}
