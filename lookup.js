document.getElementById('lookup-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const confirmationNumber = document.getElementById('confirmationNumber').value;
    const email = document.getElementById('email').value;
  
    fetch('http://localhost:3000/api/orders/lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ confirmationNumber, email })
    })
    .then(response => {
      if (!response.ok) throw new Error('Order not found');
      return response.json();
    })
    .then(order => {
        const resultDiv = document.getElementById('order-result');
        
        // Inject table structure
        resultDiv.innerHTML = `
          <h3 class="mb-4">🧾 Order #BZ-${order.order_id}</h3>
          <p><strong>Name:</strong> ${order.customer_name}</p>
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>Shipping Address:</strong> ${order.address}</p>
          <p><strong>Delivery Date:</strong> ${order.delivery_date}</p>
      
<table class="receipt-table">
  <thead>
    <tr>
      <th>Item</th>
      <th>Qty</th>
      <th>Price</th>
      <th>Subtotal</th>
    </tr>
  </thead>
  <tbody id="order-items"></tbody>
  <tfoot>
    <tr>
      <td colspan="3">Total</td>
      <td id="order-total"></td>
    </tr>
  </tfoot>
</table>
        `;
      
        displayOrderDetails(order); // render table rows + total
      })
    .catch(err => {
      console.error('Lookup error:', err);
      document.getElementById('order-result').innerHTML = '<p class="text-danger">❌ No order found with that info.</p>';
    });
  });

  function displayOrderDetails(order) {
    const orderItemsContainer = document.getElementById("order-items");
    const totalDisplay = document.getElementById("order-total");
  
    let total = 0;
    orderItemsContainer.innerHTML = '';
  
    order.items.forEach(item => {
      const subtotal = parseFloat(item.price) * item.quantity;
      total += subtotal;
  
      const row = `
        <tr>
          <td>${item.product_name}</td>
          <td>${item.quantity}</td>
          <td>$${parseFloat(item.price).toFixed(2)}</td>
          <td>$${subtotal.toFixed(2)}</td>
        </tr>
      `;
      orderItemsContainer.innerHTML += row;
    });
  
    totalDisplay.textContent = `$${total.toFixed(2)}`;
  }