// Copyright (c) 2025, Samiul Sakib and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Vehicle Availability", {
// 	refresh(frm) {

// 	},
// });
frappe.ui.form.on('Vehicle Availability', {
    vehicle_chassis_no(frm) {
      if (frm.doc.vehicle_chassis_no) {
        frappe.call({
          method: "frappe.client.get",
          args: {
            doctype: "Vehicle Details",
            name: frm.doc.vehicle_chassis_no
          },
          callback: function(r) {
            if (r.message) {
              frm.set_value("vehicle_name", r.message.vehicle_name);
              frm.set_value("model_year", r.message.model_year);
              frm.set_value("shape", r.message.shape);
              frm.set_value("auction_grade", r.message.auction_grade);
              frm.set_value("color", r.message.color);
              frm.set_value("mileage", r.message.mileage);
              frm.set_value("cc", r.message.cc);
              frm.set_value("description", r.message.description);
            }
          }
        });
      }
    },
  
    status(frm) {
      const show = (fields) => {
        ['port_location', 'shed_number', 'ship_details', 'in_house_address', 'workshop_address', 'other_details']
          .forEach(f => frm.set_df_property(f, 'hidden', !fields.includes(f)));
      }
  
      switch (frm.doc.status) {
        case "Port":
          show(['port_location', 'shed_number']);
          break;
        case "Onship":
          show(['ship_details']);
          break;
        case "In House":
          show(['in_house_address']);
          break;
        case "Workshop":
          show(['workshop_address']);
          break;
        case "Other":
          show(['other_details']);
          break;
        default:
          show([]);
      }
    },
  
    onload(frm) {
      frm.trigger("status");
    }
  });
  