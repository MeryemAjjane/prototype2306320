import { useState } from "react";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import KeyboardArrowDownIcon from 
    "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from 
    "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";

export default function App() {
    const [open, setOpen] = useState(false);
    return (
        <>
            <h1 style={{
                display: "flex", 
                justifyContent: "center",
                color: "green"
            }}>
                GeeksForGeeks
            </h1>
            <Card sx={{
                minWidth: 300,
                border: "1px solid rgba(211,211,211,0.6)"
            }}>
                <CardHeader
                    title="Complete Interview Preparation"
                    action={
                        <IconButton
                            onClick={() => setOpen(!open)}
                            aria-label="expand"
                            size="small"
                        >
                            {open ? <KeyboardArrowUpIcon />
                                : <KeyboardArrowDownIcon />}
                        </IconButton>
                    }
                ></CardHeader>
                <div style={{ 
                    backgroundColor: "rgba(211,211,211,0.4)" 
                }}>
                    <Collapse in={open} timeout="auto"
                        unmountOnExit>
                        <CardContent>
                            <Container sx={{ 
                                height: 100, 
                                lineHeight: 2 
                            }}>
                                An interview-centric course 
                                designed to prepare you for 
                                the role of SDE for both
                                product and service-based 
                                companies. A placement 
                                preparation pack built with
                                years of expertise. Learn 
                                Resume Building, C++, Java, 
                                DSA, CS Theory concepts,
                                Aptitude, Reasoning, LLD, 
                                and much more!
                            </Container>
                        </CardContent>
                    </Collapse>
                </div>
            </Card>
        </>
    );
}