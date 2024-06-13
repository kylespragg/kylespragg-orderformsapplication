<h1>This is my order forms project.</h1>

<p>The purpose of this project is to design, test, and implement an order forms application for a dental business. This is implemented through React, Node, and CSS.</p>

<p>The project is similar to that of a basic to-do list, where we want to send the item object to the backend server (Node) through Object-Relational Mapping. 
  I use axios to define my endpoints, and SQLite3 as my database.</p>


<p>In general, there are 3 pages that are rendered onto a singular page "App.js" depending on what is selected. I have a SendOrderPage, CheckOrderPage, and OrderHistoryPage.</p>

<h2>SendOrderPage</h2>
<p>The SendOrderPage is used to create lists of items that are labeled either "General" or Hygiene" with a name, status, and quantity. The user can submit these orders on this page as well.</p>

<h2>CheckOrderPage</h2>
<p>The CheckOrdePage is used to allow the user to update the item's quantity and status. The purpose of this is to keep track of unfufilled orders received from dental suppliers. Currently, the user updates the quantity and the status separately,
  and this may be changed to automatically adjust the status when the quantity is changed. This page will also be updated to remove orders from the search query when they are marked complete, but they still will exist on the OrderHistoryPage.</p>

<h3>OrderHistoryPage</h3>
<p>The purpose of this page is to keep track of the order history. This page is still being implemented currently.</p>


<h1>Some Notes</h1>

<p>This is my first major project, so there may be tidbits of code that are unnecessary and unfamiliar. If you plan to use this project as a skeleton, I recommend to review the concepts I used,
gain some insights, and design the project yourself from scratch.<br>I left the React README file in the orderformsgfd folder if you want to download it for yourself!<br>Downloading Node and using it is
a whole other process in itself, so I will be linking a useful resource from YouTube made by Tech Endeavor. If you are new to projects like me, I highly recommend watching this tutorial
as it applies to a lot of the concepts I used in my project, especially on the backend.<br>Link=[https://www.youtube.com/playlist?list=PL84tBTIF9oqIka86oSQwNoziQ9ONTSXu1](url)</p>
