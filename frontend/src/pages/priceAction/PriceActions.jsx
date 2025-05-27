import react, {useState, useEffect } from 'react'
import ModalDialog from "../../components/common/ModalDialog";
import AddPriceActionForm from "../../components/dialogs/AddPriceActionForm";
import { createPriceAction, getAllPriceActions } from "../../api/priceAction";
import ListItemLayout from "../../components/layouts/ItemDetailsLayout";

const PriceActions = () => {
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchPA = async () => {
      const res = await getAllPriceActions();
      setItems(res);
      if(res.length > 0){
        setSelected(res[0]);
      }
    };
    fetchPA();
  }, []);

  const handleAddNew = async (data) => {
    await createPriceAction(data);
    setOpenDialog(false);
    // Refetch after adding
    const res = await getAllPriceActions();
    const pa = res.map((pa) => ({
      _id: pa._id,
      symbol: pa.symbol.symbol,
      follows_demand_supply: pa.follows_demand_supply,
      trend_direction_HTF: pa.trend_direction_HTF,
      current_EMA_alignment: pa.current_EMA_alignment,
      notes: pa.notes,
    }));
    setItems(pa);
  };

  const renderDetails = (item) => (
    <div>
      <h2 className="text-2xl font-bold mb-4">{item.symbol.symbol} Details</h2>
      <p className="text-gray-600 mb-2">
        Follows Demand Supply: {item.follows_demand_supply ? "✅" : "❌"}
      </p>
      <p className="text-gray-600 mb-2">
        Trend Direction HTF: {item.trend_direction_HTF}
      </p>
      <p className="text-gray-600 mb-2">
        EMA Alignment: {item.current_EMA_alignment}
      </p>
      <p className="text-gray-600">Notes: {item.notes}</p>
      <AddPriceActionForm
        initialData={item}
        onSubmit={handleAddNew}
        onCancel={() => setSelected(null)}
        priceAction={selected}
      />
    </div>
  );

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <h1 className="text-2xl font-semibold">Price Action Logs</h1>
        <button
          onClick={() => setOpenDialog(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add New
        </button>
      </div>

      <ListItemLayout
        items={items}
        selectedItem={selected}
        onSelect={setSelected}
        renderDetails={renderDetails}
      />

      <ModalDialog
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        title="Add New Price Action"
      >
        <AddPriceActionForm
          onSubmit={handleAddNew}
          onCancel={() => setOpenDialog(false)}
        />
      </ModalDialog>
    </>
  );
};

export default PriceActions;
