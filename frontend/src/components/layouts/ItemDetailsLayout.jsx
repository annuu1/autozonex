import React, { useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Divider, Paper, Typography, Box } from '@mui/material';

const ItemDetailsLayout = ({ items, renderItem, renderDetails, listHeader = "Items" }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelect = (idx) => {
    setSelectedIndex(idx);
  };

  return (
    <div className="flex h-full min-h-[400px] rounded-lg overflow-hidden border border-gray-200 bg-white">
      {/* Left: Items List */}
      <Paper
        elevation={0}
        className="w-64 border-r border-gray-200 bg-gray-50"
        square
      >
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-100">
          <Typography variant="h6" className="!font-semibold !text-base">
            {listHeader}
          </Typography>
        </div>
        <List disablePadding>
          {items && items.length > 0 ? (
            items.map((item, idx) => (
              <ListItem
                key={item.id || idx}
                disablePadding
                className="!block"
              >
                <ListItemButton
                  selected={idx === selectedIndex}
                  onClick={() => handleSelect(idx)}
                  className={`!rounded-none !pl-6 !pr-4 !py-2
                    ${idx === selectedIndex
                      ? 'bg-blue-100 font-semibold text-blue-900 border-l-4 border-blue-600'
                      : 'border-l-4 border-transparent'}
                  `}
                >
                  <ListItemText
                    primary={
                      renderItem
                        ? renderItem(item)
                        : (item.name || item.title || `Item ${idx + 1}`)
                    }
                    primaryTypographyProps={{
                      className: idx === selectedIndex ? 'font-semibold' : ''
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem className="!pl-6 !py-4 text-gray-400">
              <ListItemText primary="No items" />
            </ListItem>
          )}
        </List>
      </Paper>
      {/* Right: Details */}
      <Box className="flex-1 p-6 overflow-y-auto">
        {items && items.length > 0 && renderDetails
          ? renderDetails(items[selectedIndex])
          : <Typography className="text-gray-400">Select an item to see details</Typography>
        }
      </Box>
    </div>
  );
};

export default ItemDetailsLayout;

