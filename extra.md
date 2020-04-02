const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VetSchema = new Schema({
    email: { type: String, unique: true, lowercase: true, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    picture: { type: String, default: '', trim: true },
    address: { type: String, default: '(Please update address)', trim: true },
    city: { type: String, default: '(Please update city)', trim: true },
    state: { type: String, default: '(Please update state)', trim: true },
    classification: { type: String, default: ''},
    certs: {type: String, default: ''}
  
})

module.exports = mongoose.model('Vet', VetSchema);



<div class="container"> 
    <h1>Law Enforcement</h1>
    <div class="row">
        <% lawEnforcement.forEach(({image, title, description}) => { %> 
            <div class="col-md-4" style="width:20rem;">
                <div class="card">
                    <img src="<%= image %>" class="card-img-top" alt="..." />
                    <div class="card-body">
                        <h5 class="card-title"><%= title %></h5>
                        <p class="card-text"><%= description %> </p>
                    </div>
                </div>
            </br>
            </div>
        <% }) %>
    </div>
</div> 
<div class="container"> 
    <h1>Firefighters/Paramedics</h1>
    <div class="row">
        <% fire.forEach(({image, title, description}) => { %> 
            <div class="col-md-4" style="width:20rem;">
                <div class="card">
                    <img src="<%= image %>" class="card-img-top" alt="..." />
                    <div class="card-body">
                        <h5 class="card-title"><%= title %></h5>
                        <p class="card-text"><%= description %> </p>
                    </div>
                </div>
            </br>
            </div>
        <% }) %>
    </div>
</div> 