import * as React from 'react';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { Divider, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

function generate(element: React.ReactElement) {
    return [0, 1, 2].map((value) =>
        React.cloneElement(element, {
            key: value,
        }),
    );
}

export default function Lobby() {
    const userName = useAppSelector(s => s.auth.name)

    const [chatMessages, setChatMessages] = React.useState();

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                color: '#fff',
                '& > .MuiBox-root > .MuiBox-root': {
                    p: 1,
                    borderRadius: 2,
                },
                alignItems: 'center'
            }}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gridAutoRows: '40px',
                    gap: 5,
                    gridTemplateRows: 'auto',
                    gridTemplateAreas: `
                    "header header header header"
                    "chat chat teams teams"
                    "footer footer footer footer"`,

                }}
            >
                <Box sx={{ gridArea: 'header', bgcolor: 'primary.main', gridRow: 'span 2' }}>
                    Header + инфа с таймерами
                    <Link to='/game'>game</Link>
                    <Link to='/game2'>game2</Link>
                </Box>
                <Box sx={{ gridArea: 'chat', bgcolor: 'info.main', textAlign: 'center', gridRow: '3/12' }}>
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                        Общий чат
                    </Typography>
                    <List sx={{ width: '100%', height: '80%', bgcolor: 'background.paper' }}>
                        <Demo>
                            {generate(
                                <> 
                                {/* //TODO: extract to component Message */}
                                    <ListItem>
                                        <ListItemIcon>
                                            <PersonIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Single-line item"
                                            secondary='Secondary text'
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </>
                            )}
                            {/* TODO: Add chat text field */}
                        </Demo>

                    </List>
                </Box>
                <Box sx={{ gridArea: 'teams', bgcolor: 'secondary.main', textAlign: 'center', gridRow: '3/12' }}>
                    <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                        Доступные группы
                    </Typography>
                </Box>
                <Box sx={{
                    gridArea: 'footer',
                    bgcolor: 'warning.main',
                    bottom: 0,
                    gridRow: '12/14'
                }}>Тут ссылка на пожертвования 🤑</Box>
            </Box>
        </Box>
    );
}
