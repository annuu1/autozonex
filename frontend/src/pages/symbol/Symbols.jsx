import react, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AddSymbol from '../../components/dialogs/AddSymbol.jsx';

const Symbols = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [symbol, setSymbol] = useState('');
    const [name, setName] = useState('');
    const [exchange, setExchange] = useState('');
    const [sector, setSector] = useState('');
    const [industry, setIndustry] = useState('');
    const [active, setActive] = useState(true);
    const [openAddSymbol, setOpenAddSymbol] = useState(false);
    const handleAddSymbol = () => {
        setOpenAddSymbol(true);
    };
    const handleAddSymbolClose = () => {
        setOpenAddSymbol(false);
    };
    const handleAddSymbolSubmit = (symbol) => {
        setOpenAddSymbol(false);
    };

    return (
        <AddSymbol 
            open={openAddSymbol}
            onClose={handleAddSymbolClose}
            onSubmit={handleAddSymbolSubmit}
        />
    )   
}
export default Symbols;
