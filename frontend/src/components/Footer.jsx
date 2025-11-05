import React from 'react';
import { Box, Typography, Link, Container, IconButton } from '@mui/material';
import { Facebook, Instagram, Twitter } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        backgroundColor: '#5e21a3',
        color: '#FFFFFF',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <IconButton
            aria-label="Facebook"
            href=""
            sx={{
              color: '#FFFFFF',
              '&:hover': {
                transform: 'scale(1.2)',
              },
              transition: 'transform 0.2s',
            }}
          >
            <Facebook />
          </IconButton>
          <IconButton
            aria-label="Instagram"
            href=""
            sx={{
              color: '#FFFFFF',
              '&:hover': {
                transform: 'scale(1.2)',
              },
              transition: 'transform 0.2s',
            }}
          >
            <Instagram />
          </IconButton>
          <IconButton
            aria-label="Twitter"
            href=""
            sx={{
              color: '#FFFFFF',
              '&:hover': {
                transform: 'scale(1.2)',
              },
              transition: 'transform 0.2s',
            }}
          >
            <Twitter />
          </IconButton>
        </Box>
        <Typography variant="body2">Infomações · Suporte </Typography>
        <Typography variant="body2" sx={{ my: 1 }}>
          <Link color="inherit" sx={{ mx: 1, cursor:'pointer' }}>
            Termos de uso
          </Link>
          ·
          <Link color="inherit" sx={{ mx: 1, cursor:'pointer' }}>
            Política de privacidade
          </Link>
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {'© '}
          {new Date().getFullYear()} AgendAi LTDA
        </Typography>
      </Container>
    </Box>
  );
};
