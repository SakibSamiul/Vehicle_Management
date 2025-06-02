// Copyright (c) 2025, Samiul Sakib and contributors
// For license information, please see license.txt

frappe.ui.form.on('Vehicle Price', {

  chassis_no(frm) {
    if (!frm.doc.chassis_no) return;

    frappe.db.get_doc('Vehicle Details', frm.doc.chassis_no).then(doc => {
      frm.set_value('car_name', doc.car_model || '');
      frm.clear_table('other_vehicle_name');

      const existing_items = new Set(); 

      (doc.vehicle_items || []).forEach(vehicle_item => {
        if (!existing_items.has(vehicle_item.item)) {
          const child = frm.add_child('other_vehicle_name');
          child.item = vehicle_item.item;
          child.qty = 0;
          child.rate = 0;
          child.amount = 0;
          existing_items.add(vehicle_item.item);
        }
      });

      frm.refresh_field('other_vehicle_name');
    });
  },

  company_price(frm) {
    frm.trigger('update_sale_price');
  },

  customer_price(frm) {
    frm.trigger('update_sale_price');
  },

  update_sale_price(frm) {
    const company = frm.doc.company_price || 0;
    const customer = frm.doc.customer_price || 0;
    const sale_price = company + customer;

    frm.set_value('sale_price', sale_price);
    frm.trigger('update_grand_total');
  },

  update_grand_total(frm) {
    const sale_price = frm.doc.sale_price || 0;
    const total_amount = frm.doc.total_amount || 0;
    const grand_total = sale_price + total_amount;

    frm.set_value('grand_total', grand_total);

    frappe.call({
      method: 'vehicle_management.utils.utils.get_money_in_words',
      args: { number: grand_total },
      callback: r => {
        if (r.message) {
          frm.set_value('in_words', r.message);
        }
      }
    });
  },

  recalculate_totals(frm) {
    let total_qty = 0;
    let total_amt = 0;

    (frm.doc.other_vehicle_name || []).forEach(row => {
      total_qty += row.qty || 0;
      total_amt += row.amount || 0;
    });

    frm.set_value('total_quantity', total_qty);
    frm.set_value('total_amount', total_amt);
    frm.trigger('update_grand_total');
  }
});

// === Child Table Events ===
frappe.ui.form.on('Others Vehicle Items', {
  qty: calculate_amount,
  rate: calculate_amount,

  item(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    if (!row.item) return;

    let first_occurrence = null;
    let current_row_no = null;

    frm.doc.other_vehicle_name.forEach((r, index) => {
      if (r.item === row.item) {
        if (!first_occurrence) {
          first_occurrence = index + 1;
        } else if (r.name === row.name) {
          current_row_no = index + 1;
        }
      }
    });

    if (first_occurrence && current_row_no && current_row_no !== first_occurrence) {
      frappe.msgprint(
        `Item <b>'${row.item}'</b> already added at row <b>${first_occurrence}</b> (you tried again at row <b>${current_row_no}</b>).`
      );

      frappe.model.set_value(cdt, cdn, 'item', '');
    }
  },

  other_vehicle_name_add(frm) {
    frm.trigger('recalculate_totals');
  },

  other_vehicle_name_remove(frm) {
    frm.trigger('recalculate_totals');
  }
});

// === Shared Calculation ===
function calculate_amount(frm, cdt, cdn) {
  const row = locals[cdt][cdn];
  row.amount = (row.qty || 0) * (row.rate || 0);
  frappe.model.set_value(cdt, cdn, 'amount', row.amount);
  frm.trigger('recalculate_totals');
}
