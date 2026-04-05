/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9998, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET /movies/522627"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/315162"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/412656"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/585083"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/901"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/284054"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/424"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/389"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/49026"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/268"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/466272"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/505642"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/496243"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/297762"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/460135"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/374720"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/157336"], "isController": false}, {"data": [0.995, 500, 1500, "GET /movies/724495"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/454626"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/438631"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/76341"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/493922"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/490132"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/721656"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/361743"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/497"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/763215"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/428687"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/372058"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/399579"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/11"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/512200"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/419704"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/565770"], "isController": false}, {"data": [0.995, 500, 1500, "GET /movies/459003"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/769"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/603"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/24428"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/329865"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/129"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/693134"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/13"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/399055"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/527774"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/122"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/639720"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/19995"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/121"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/120"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/385687"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/680"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/240"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/348350"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/573435"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/271110"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/609681"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/12477"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/414906"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/68718"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/244786"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/675353"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/507089"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/637"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/99861"], "isController": false}, {"data": [0.995, 500, 1500, "GET /movies/717930"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/238"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/718789"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/313369"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/575265"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/278"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/311"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/155"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/550"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/27205"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/616037"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/539681"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/496450"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/299536"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/447365"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/551271"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/558144"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/594767"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/299534"], "isController": false}, {"data": [1.0, 500, 1500, "GET /movies/766507"], "isController": false}, {"data": [0.995, 500, 1500, "GET /movies/614934"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10000, 0, 0.0, 5.920499999999987, 0, 632, 1.0, 3.0, 5.0, 93.0, 167.80775943079607, 84.33978659048195, 29.31391797556719], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET /movies/522627", 100, 0, 0.0, 8.139999999999997, 0, 374, 1.0, 2.0, 79.0499999999991, 371.15999999999855, 1.7607183730962233, 0.8597257681133902, 0.3095012765208205], "isController": false}, {"data": ["GET /movies/315162", 100, 0, 0.0, 6.890000000000005, 0, 383, 1.0, 2.0, 10.699999999999932, 380.00999999999846, 1.7650692789691995, 0.8601265334039361, 0.3102660841938046], "isController": false}, {"data": ["GET /movies/412656", 100, 0, 0.0, 8.730000000000004, 0, 438, 1.0, 2.0, 78.14999999999912, 434.5299999999982, 1.7578399662494726, 0.7724882664182253, 0.30899530656729013], "isController": false}, {"data": ["GET /movies/585083", 100, 0, 0.0, 6.940000000000003, 0, 424, 1.0, 2.0, 6.849999999999966, 420.59999999999826, 1.7659732278458657, 1.0175041058877548, 0.31042498145728115], "isController": false}, {"data": ["GET /movies/901", 100, 0, 0.0, 4.340000000000002, 0, 246, 1.0, 2.0, 3.0, 244.4499999999992, 1.7276826592491492, 0.6428194269276619, 0.2986326471553705], "isController": false}, {"data": ["GET /movies/284054", 100, 0, 0.0, 6.82, 0, 445, 2.0, 2.9000000000000057, 3.9499999999999886, 441.20999999999805, 1.7389489792369492, 1.346666543491114, 0.30567462525649497], "isController": false}, {"data": ["GET /movies/424", 200, 0, 0.0, 4.975000000000002, 0, 93, 1.0, 2.0, 5.0, 90.99000000000001, 3.400319630045224, 1.3149673569315516, 0.5877505610527389], "isController": false}, {"data": ["GET /movies/389", 200, 0, 0.0, 3.0600000000000036, 0, 200, 1.0, 2.0, 3.9499999999999886, 87.91000000000008, 3.4212011837356098, 1.877651430917395, 0.5913599702355496], "isController": false}, {"data": ["GET /movies/49026", 100, 0, 0.0, 4.929999999999996, 0, 307, 1.0, 2.0, 3.9499999999999886, 304.74999999999886, 1.7439832577607255, 1.1393796869550052, 0.30485644837809556], "isController": false}, {"data": ["GET /movies/268", 100, 0, 0.0, 7.700000000000003, 0, 337, 1.0, 2.0, 40.19999999999959, 334.55999999999875, 1.747549062439928, 1.112697254600423, 0.3020665859881516], "isController": false}, {"data": ["GET /movies/466272", 100, 0, 0.0, 7.560000000000001, 0, 385, 1.0, 2.9000000000000057, 6.899999999999977, 382.0699999999985, 1.7570986786617935, 1.008959006887827, 0.3088650021085184], "isController": false}, {"data": ["GET /movies/505642", 100, 0, 0.0, 5.990000000000005, 0, 413, 1.0, 1.9000000000000057, 4.0, 409.81999999999834, 1.7776197671318106, 1.0294223846769175, 0.31247222469113856], "isController": false}, {"data": ["GET /movies/496243", 100, 0, 0.0, 7.579999999999999, 0, 383, 1.0, 2.0, 8.899999999999977, 380.0799999999985, 1.7554638813306416, 0.6720135170718862, 0.3085776353901518], "isController": false}, {"data": ["GET /movies/297762", 100, 0, 0.0, 6.299999999999998, 0, 323, 2.0, 3.0, 4.0, 320.76999999999884, 1.7378006395106353, 0.6431898851313778, 0.3054727686639789], "isController": false}, {"data": ["GET /movies/460135", 100, 0, 0.0, 7.370000000000006, 0, 326, 1.5, 2.9000000000000057, 3.9499999999999886, 323.65999999999883, 1.7420085358418256, 1.0768470734256597, 0.3062124379409459], "isController": false}, {"data": ["GET /movies/374720", 100, 0, 0.0, 6.029999999999997, 0, 274, 1.0, 2.0, 3.9499999999999886, 272.1899999999991, 1.742038882307853, 0.8063734670057835, 0.3062177722806773], "isController": false}, {"data": ["GET /movies/157336", 200, 0, 0.0, 3.49, 0, 233, 1.0, 2.0, 4.0, 88.0, 3.4375483405235387, 1.4468587253570755, 0.6042565442326533], "isController": false}, {"data": ["GET /movies/724495", 100, 0, 0.0, 8.310000000000002, 0, 632, 1.0, 2.0, 4.949999999999989, 626.6599999999972, 1.7837076146478068, 0.9946260234022438, 0.3135423541373098], "isController": false}, {"data": ["GET /movies/454626", 100, 0, 0.0, 7.209999999999999, 0, 355, 1.0, 2.0, 6.0, 352.36999999999864, 1.7559570844088572, 0.9500002194946355, 0.3086643312437444], "isController": false}, {"data": ["GET /movies/438631", 100, 0, 0.0, 4.819999999999999, 0, 302, 1.0, 2.0, 3.9499999999999886, 299.8899999999989, 1.7349966167565973, 1.1318141992123116, 0.30497987403924565], "isController": false}, {"data": ["GET /movies/76341", 100, 0, 0.0, 5.190000000000002, 0, 409, 1.0, 2.9000000000000057, 4.0, 405.039999999998, 1.7409470752089136, 0.863672963091922, 0.3043257094359332], "isController": false}, {"data": ["GET /movies/493922", 100, 0, 0.0, 7.640000000000001, 0, 326, 1.0, 2.0, 42.999999999999545, 323.6699999999988, 1.7455357922114194, 0.874472520902791, 0.30683246347466353], "isController": false}, {"data": ["GET /movies/490132", 100, 0, 0.0, 6.36, 0, 339, 1.0, 2.9000000000000057, 3.9499999999999886, 336.5299999999987, 1.7503325631870055, 0.9008059187495624, 0.30767564587271584], "isController": false}, {"data": ["GET /movies/721656", 100, 0, 0.0, 5.189999999999998, 0, 419, 1.0, 2.0, 3.9499999999999886, 414.89999999999793, 1.7814515267039583, 0.735892574019311, 0.3131457761784302], "isController": false}, {"data": ["GET /movies/361743", 100, 0, 0.0, 7.7400000000000055, 0, 437, 1.0, 2.0, 5.849999999999966, 433.50999999999823, 1.768972227136034, 0.9242188882009552, 0.310952149301256], "isController": false}, {"data": ["GET /movies/497", 200, 0, 0.0, 3.9399999999999955, 0, 217, 1.0, 2.9000000000000057, 4.0, 91.98000000000002, 3.4328870580157913, 1.7935493906625473, 0.5933798918640577], "isController": false}, {"data": ["GET /movies/763215", 100, 0, 0.0, 7.42, 0, 436, 1.0, 2.0, 4.949999999999989, 432.5799999999982, 1.7744654422855115, 0.6498286531807294, 0.3119177535267501], "isController": false}, {"data": ["GET /movies/428687", 100, 0, 0.0, 7.190000000000001, 0, 339, 1.0, 2.9000000000000057, 10.64999999999992, 336.5299999999987, 1.7524490475439427, 0.5972702320242539, 0.30804768413858363], "isController": false}, {"data": ["GET /movies/372058", 200, 0, 0.0, 4.1850000000000005, 0, 274, 1.0, 2.0, 3.0, 91.0, 3.4379028792436612, 1.7189514396218308, 0.6043188654920498], "isController": false}, {"data": ["GET /movies/399579", 100, 0, 0.0, 7.819999999999999, 0, 342, 1.0, 2.0, 47.74999999999949, 339.50999999999874, 1.7466943808841766, 0.8562896281287663, 0.3070361216397967], "isController": false}, {"data": ["GET /movies/11", 100, 0, 0.0, 4.190000000000002, 0, 236, 1.0, 2.0, 3.0, 234.53999999999925, 1.728040920008986, 0.9078964989890961, 0.2970070331265444], "isController": false}, {"data": ["GET /movies/512200", 100, 0, 0.0, 7.580000000000006, 0, 315, 1.0, 2.0, 81.94999999999908, 312.76999999999884, 1.756296322315501, 0.7906763716674277, 0.30872396290702164], "isController": false}, {"data": ["GET /movies/419704", 100, 0, 0.0, 6.979999999999997, 0, 315, 1.0, 2.9000000000000057, 9.699999999999932, 312.77999999999884, 1.751927119831815, 1.0590262570077085, 0.3079559390329362], "isController": false}, {"data": ["GET /movies/565770", 100, 0, 0.0, 7.340000000000001, 0, 392, 1.0, 2.0, 8.699999999999932, 388.95999999999844, 1.771385045967442, 0.9272093599985829, 0.3113762776114644], "isController": false}, {"data": ["GET /movies/459003", 100, 0, 0.0, 8.510000000000003, 0, 505, 1.0, 2.0, 5.899999999999977, 501.6399999999983, 1.7882049998211795, 0.7509063964092844, 0.31433291012481673], "isController": false}, {"data": ["GET /movies/769", 200, 0, 0.0, 5.025, 0, 278, 1.0, 2.0, 4.0, 92.97000000000003, 3.4051826880512137, 1.4332360728028057, 0.5885911482276024], "isController": false}, {"data": ["GET /movies/603", 100, 0, 0.0, 7.1599999999999975, 0, 306, 1.0, 2.0, 41.14999999999958, 303.8299999999989, 1.7261617068286959, 0.6877675550645584, 0.298369748153007], "isController": false}, {"data": ["GET /movies/24428", 100, 0, 0.0, 5.189999999999999, 0, 344, 1.0, 2.0, 4.0, 341.4499999999987, 1.736804626847526, 0.8972359839866614, 0.3036015900446359], "isController": false}, {"data": ["GET /movies/329865", 100, 0, 0.0, 6.980000000000002, 1, 203, 4.0, 5.0, 6.0, 201.96999999999946, 1.735900151023313, 0.6543529866162099, 0.30513869842206676], "isController": false}, {"data": ["GET /movies/129", 200, 0, 0.0, 3.965000000000001, 0, 199, 1.0, 2.0, 4.0, 89.99000000000001, 3.4212011837356098, 1.4433192493884601, 0.5913599702355496], "isController": false}, {"data": ["GET /movies/693134", 100, 0, 0.0, 6.3999999999999995, 0, 460, 1.0, 2.0, 4.0, 456.29999999999814, 1.7798344753937885, 0.938584586633443, 0.3128615288778144], "isController": false}, {"data": ["GET /movies/13", 100, 0, 0.0, 6.610000000000006, 1, 243, 2.0, 3.0, 8.749999999999943, 241.47999999999922, 1.6935087808430287, 0.7756402521634574, 0.29107182170739554], "isController": false}, {"data": ["GET /movies/399055", 100, 0, 0.0, 7.319999999999996, 0, 351, 1.0, 2.9000000000000057, 9.699999999999932, 348.4199999999987, 1.7542628587467546, 0.7914740632236335, 0.30836651813907795], "isController": false}, {"data": ["GET /movies/527774", 100, 0, 0.0, 6.209999999999996, 0, 299, 1.0, 2.9000000000000057, 3.9499999999999886, 296.95999999999896, 1.7451397856968343, 1.0446979381173431, 0.30676285295452166], "isController": false}, {"data": ["GET /movies/122", 200, 0, 0.0, 5.685000000000001, 0, 196, 1.0, 2.0, 37.349999999999625, 90.99000000000001, 3.404255319148936, 2.61968085106383, 0.5884308510638298], "isController": false}, {"data": ["GET /movies/639720", 100, 0, 0.0, 7.9599999999999955, 0, 500, 1.0, 2.0, 4.0, 496.9899999999985, 1.7878852892798398, 0.6582351113852535, 0.31427671100622184], "isController": false}, {"data": ["GET /movies/19995", 100, 0, 0.0, 5.75, 0, 214, 1.0, 2.0, 6.849999999999966, 212.73999999999936, 1.723127821621808, 0.6730968053210187, 0.3012108203811559], "isController": false}, {"data": ["GET /movies/121", 100, 0, 0.0, 4.940000000000001, 0, 291, 1.0, 2.0, 3.0, 288.999999999999, 1.7292062943109112, 1.3728952317136436, 0.2988960098564759], "isController": false}, {"data": ["GET /movies/120", 100, 0, 0.0, 4.869999999999998, 0, 300, 1.0, 2.0, 3.0, 297.95999999999896, 1.731991617160573, 1.0452840033254238, 0.2993774572631068], "isController": false}, {"data": ["GET /movies/385687", 100, 0, 0.0, 7.83, 0, 372, 1.0, 2.0, 75.39999999999918, 369.1299999999985, 1.762891141472014, 1.086312802996915, 0.30988320846187745], "isController": false}, {"data": ["GET /movies/680", 200, 0, 0.0, 6.265000000000002, 0, 443, 1.0, 3.0, 5.949999999999989, 90.99000000000001, 3.3743883921039313, 1.5454962459929138, 0.5832683060570272], "isController": false}, {"data": ["GET /movies/240", 200, 0, 0.0, 3.8500000000000028, 0, 96, 1.0, 2.0, 5.949999999999989, 90.98000000000002, 3.415592178293912, 1.5376835880795834, 0.5903904448808812], "isController": false}, {"data": ["GET /movies/348350", 100, 0, 0.0, 6.820000000000001, 0, 366, 1.0, 2.9000000000000057, 3.0, 363.2699999999986, 1.7451397856968343, 0.7498647516666085, 0.30676285295452166], "isController": false}, {"data": ["GET /movies/573435", 100, 0, 0.0, 6.590000000000003, 0, 475, 1.0, 2.0, 4.949999999999989, 471.19999999999806, 1.7826900793297085, 0.631949705856137, 0.3133634905071753], "isController": false}, {"data": ["GET /movies/271110", 100, 0, 0.0, 5.86, 0, 299, 1.0, 2.0, 4.949999999999989, 296.91999999999894, 1.7350568231109569, 0.9183601544200573, 0.3049904571874729], "isController": false}, {"data": ["GET /movies/609681", 100, 0, 0.0, 6.730000000000002, 0, 390, 1.0, 2.0, 7.899999999999977, 386.9799999999984, 1.7723268879712175, 1.0038570263899473, 0.31154183577619055], "isController": false}, {"data": ["GET /movies/12477", 100, 0, 0.0, 4.239999999999998, 0, 249, 1.0, 2.0, 3.0, 247.40999999999917, 1.7275931172690209, 0.9768324364245733, 0.301991374991362], "isController": false}, {"data": ["GET /movies/414906", 100, 0, 0.0, 6.389999999999998, 0, 374, 1.0, 2.0, 4.0, 371.1299999999985, 1.7735213265939522, 0.6789261328367474, 0.31175179569034317], "isController": false}, {"data": ["GET /movies/68718", 100, 0, 0.0, 4.2299999999999995, 0, 320, 1.0, 2.0, 4.0, 316.90999999999843, 1.744013673067197, 0.6148329452902911, 0.3048617651162385], "isController": false}, {"data": ["GET /movies/244786", 100, 0, 0.0, 4.850000000000001, 0, 302, 1.0, 2.0, 3.9499999999999886, 299.7999999999989, 1.7410380068596898, 0.6086832094294619, 0.30604183714330485], "isController": false}, {"data": ["GET /movies/675353", 100, 0, 0.0, 6.65, 0, 402, 1.0, 2.0, 7.7999999999999545, 398.81999999999834, 1.7651004342147067, 1.108358964062555, 0.3102715607018039], "isController": false}, {"data": ["GET /movies/507089", 100, 0, 0.0, 6.260000000000002, 0, 318, 1.0, 2.0, 5.949999999999989, 315.7399999999989, 1.7497506605308744, 0.8407005126769435, 0.3075733582964427], "isController": false}, {"data": ["GET /movies/637", 200, 0, 0.0, 2.629999999999999, 0, 179, 1.0, 2.0, 4.0, 89.51000000000045, 3.4273571648901533, 1.8576008071426124, 0.5924240411968331], "isController": false}, {"data": ["GET /movies/99861", 100, 0, 0.0, 4.960000000000001, 0, 308, 1.0, 2.0, 3.9499999999999886, 305.91999999999894, 1.7378610406311912, 1.0844660204720031, 0.30378625612596016], "isController": false}, {"data": ["GET /movies/717930", 100, 0, 0.0, 8.439999999999992, 0, 565, 1.0, 1.0, 2.9499999999999886, 561.2899999999981, 1.7891648178630215, 0.8980768714663995, 0.3145016281399842], "isController": false}, {"data": ["GET /movies/238", 200, 0, 0.0, 5.0299999999999985, 0, 94, 1.0, 3.0, 6.899999999999977, 91.97000000000003, 3.3997994118347017, 1.7862227378584663, 0.5876606405222092], "isController": false}, {"data": ["GET /movies/718789", 100, 0, 0.0, 7.260000000000006, 0, 466, 1.0, 2.0, 5.899999999999977, 462.169999999998, 1.7668468850489416, 0.6435877813703664, 0.3105785540125093], "isController": false}, {"data": ["GET /movies/313369", 100, 0, 0.0, 5.85, 0, 356, 2.0, 3.0, 3.0, 353.09999999999854, 1.7389489792369492, 1.0070280709838972, 0.30567462525649497], "isController": false}, {"data": ["GET /movies/575265", 100, 0, 0.0, 9.180000000000001, 0, 416, 1.0, 2.0, 81.94999999999999, 412.7399999999983, 1.7615868374231507, 1.1526007627671004, 0.3096539362657882], "isController": false}, {"data": ["GET /movies/278", 200, 0, 0.0, 4.325000000000005, 0, 295, 1.0, 2.0, 4.0, 93.95000000000005, 3.420674557022645, 2.1178785831565983, 0.5912689419853595], "isController": false}, {"data": ["GET /movies/311", 200, 0, 0.0, 3.940000000000004, 0, 319, 1.0, 2.0, 3.0, 89.99000000000001, 3.4328870580157913, 1.4314870837624443, 0.5933798918640577], "isController": false}, {"data": ["GET /movies/155", 200, 0, 0.0, 6.284999999999998, 0, 412, 1.0, 2.0, 5.899999999999977, 93.96000000000004, 3.4035601238895885, 2.0906633964126478, 0.5883106854770089], "isController": false}, {"data": ["GET /movies/550", 100, 0, 0.0, 4.819999999999999, 2, 90, 4.0, 5.0, 5.0, 89.32999999999966, 1.6869380387658361, 0.8648852249531874, 0.2915898758413603], "isController": false}, {"data": ["GET /movies/27205", 100, 0, 0.0, 2.9800000000000018, 0, 199, 1.0, 2.0, 3.0, 197.06999999999903, 1.7349966167565973, 0.8658039757447473, 0.30328554140569425], "isController": false}, {"data": ["GET /movies/616037", 100, 0, 0.0, 5.86, 0, 479, 1.0, 2.0, 4.899999999999977, 474.2899999999976, 1.779264452075512, 1.103352467839795, 0.31276132946639856], "isController": false}, {"data": ["GET /movies/539681", 100, 0, 0.0, 6.920000000000001, 0, 430, 1.0, 2.0, 5.899999999999977, 426.56999999999823, 1.7743709854856453, 0.9010477660669293, 0.31190114979239864], "isController": false}, {"data": ["GET /movies/496450", 100, 0, 0.0, 7.139999999999999, 0, 445, 1.0, 2.0, 4.949999999999989, 441.4799999999982, 1.783675799086758, 0.7246182933789954, 0.3135367615582192], "isController": false}, {"data": ["GET /movies/299536", 100, 0, 0.0, 7.169999999999999, 0, 434, 1.0, 2.0, 3.9499999999999886, 430.53999999999826, 1.71939477303989, 1.2307777037482808, 0.3022373624484182], "isController": false}, {"data": ["GET /movies/447365", 100, 0, 0.0, 6.259999999999999, 0, 427, 1.0, 2.0, 3.9499999999999886, 423.59999999999826, 1.777019582755802, 0.8919805327504708, 0.3123667235312933], "isController": false}, {"data": ["GET /movies/551271", 100, 0, 0.0, 6.72, 0, 485, 1.0, 2.0, 3.9499999999999886, 481.069999999998, 1.7852679687221051, 0.6311201217552754, 0.31381663512693253], "isController": false}, {"data": ["GET /movies/558144", 100, 0, 0.0, 7.389999999999999, 0, 453, 1.0, 2.0, 3.9499999999999886, 449.38999999999817, 1.759479194158529, 0.5601466965778129, 0.3092834520981789], "isController": false}, {"data": ["GET /movies/594767", 100, 0, 0.0, 6.739999999999995, 0, 401, 1.0, 2.0, 7.7999999999999545, 397.81999999999834, 1.7672528055138288, 0.8180447556772996, 0.3106499072192277], "isController": false}, {"data": ["GET /movies/299534", 100, 0, 0.0, 5.690000000000001, 0, 301, 1.0, 2.0, 3.0, 298.979999999999, 1.7349966167565973, 0.957297937956521, 0.30497987403924565], "isController": false}, {"data": ["GET /movies/766507", 100, 0, 0.0, 7.47, 0, 466, 1.0, 2.0, 5.849999999999966, 462.29999999999814, 1.7744654422855115, 0.7780615074083933, 0.3119177535267501], "isController": false}, {"data": ["GET /movies/614934", 100, 0, 0.0, 7.249999999999999, 0, 506, 1.0, 2.0, 4.949999999999989, 501.8699999999979, 1.7845670640302662, 0.6082167044400029, 0.31369342922407023], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
