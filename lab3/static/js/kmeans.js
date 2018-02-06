/**
* k means algorithm
* @param data
* @param k
* @return {Object}
*/

function kmeans(data, k) {

    //Implement the algorithm here..
    //Remember to reference any code that you have not implemented yourself! 

    var centroids = [];
    for (var i = 0; i < k; i++) {
        var c = Math.floor(Math.random() * data.length);
        centroids.push(Object.values(data[c]));
    }

    var dimensions = Object.keys(data[0]).length;

    var result = {
        assignments: []
    };
    result.assignments.length = data.length;

    var clusterCounts = [];
    clusterCounts.length = k;

    var clusterSums = [];
    clusterSums.length = k;
    for (var i = 0; i < k; i++) {
        clusterSums[i] = new Array(dimensions);
    }

    var didCentroidChange = 1;
    while (didCentroidChange) {
        clusterCounts.fill(0);
        didCentroidChange = 0;

        for (var i = 0; i < k; i++) {
            clusterSums[i].fill(0);
        }
        // MOAR FOR CYCLES!!!1!!
        for (var i = 0; i < data.length; i++) {
            var closestCentroid = -1;
            var closestCentroidDistance = Number.MAX_SAFE_INTEGER;
            for (var j = 0; j < k; j++) {
                var distance = euclideanDistance(Object.values(data[i]), centroids[j]);
                if (distance < closestCentroidDistance) {
                    closestCentroidDistance = distance;
                    closestCentroid = j;
                }
            }
            var currentValues = Object.values(data[i]);
            for (var j = 0; j < dimensions; j++) {
                clusterSums[closestCentroid][j] += parseFloat(currentValues[j]);
            }
            clusterCounts[closestCentroid]++;
            if (result.assignments[i] != closestCentroid) {
                result.assignments[i] = closestCentroid;
                didCentroidChange = 1;
            }
        }
        //recalculate centroid position
        for (var i = 0; i < k; i++) {
            for (var j = 0; j < dimensions; j++) {
                centroids[i][j] = clusterSums[i][j] / clusterCounts[i];
            }
        }
    }

    function euclideanDistance(a, b) {
        var result = 0;
        for (var i = 0; i < a.length; i++) {
            result += Math.abs(a[i] - b[i]) * Math.abs(a[i] - b[i]);
        }
        return Math.sqrt(result)
    }

    return result;
};


