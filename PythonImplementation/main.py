import numpy as np
import matplotlib.pyplot as plt
from methods.adaptive_monotonicity import adaptive_monotonicity_method
from methods.brute_monotonicity import brute_monotonicity_method
from methods.saw import saw_method
from methods.exponent import exponent_method
from methods.superformula import superformula_method
from methods.bjorklund import bjorklund_method
from methods.toussaint import toussaint_method
from methods.bresenham import bresenham_method
from methods.circlemap import standard_circle_map_method
from methods.phase_density_coupling import phase_density_method

# Initial empty buffer
buffer_length = 1000
buffer = np.zeros(buffer_length)  

# Set up graph
x_values = np.linspace(0, 1, buffer_length)  
fig, ax = plt.subplots(1, 1, figsize=(10, 6))
ax.axis("off")
fig.subplots_adjust(left=0, right=1, top=1, bottom=0, wspace=0, hspace=0)
plt.tight_layout(pad=0, w_pad=0, h_pad=0)

######################################################################
# all methods (besides monotonicity passes) have first three args: 
# buffer, start phase, end phase.
######################################################################

## Apply multiple methods sequentially, passing the buffer through each

# lay down a simple ramp to modulate
# optional params: subdivision frequency, blend
saw_method(buffer, 0, 1, [1, 1])

# optional params: total steps, hits, rotation, blend
# bjorklund_method(buffer, 0, 0.5, [16, 4, 1, 0.4])

# optional params: total steps, hits, rotation, blend
bresenham_method(buffer, 0, 1, [16, 3, 0, 0.5])
# bresenham_method(buffer, 0, 1) #no optional params, uses defaults

# optional params: total steps, hits, rotation, blend
# toussaint_method(buffer, 0, 1, [16, 5, 0, 0.5])

# optional params: k, omega, start_value, blend
# standard_circle_map_method(buffer,0,1,[5, 0.9, 0, 0.5])

# optional params: subdivisions (freq), exponent, blend
# exponent_method(buffer, 0, 1, [3, 2, 0.5])

# optional params: min_freq, max_freq, min_wake, max_wake, blend
phase_density_method(buffer, 0, 1, [0.5, 0.2, 3, 0.1, 0.1])
# run multiple passes for dynamical result
phase_density_method(buffer, 0, 1, [0.5, 0.2, 3, 0.1, 0.05])
phase_density_method(buffer, 0, 1, [0.5, 0.2, 3, 0.1, 0.05])
phase_density_method(buffer, 0, 1, [0.5, 0.2, 3, 0.1, 0.05])

# optional params: m1, m2, n1, n2, n3, a, b, blend
# superformula_method(buffer, 0, 1, [4, 3, 1, 1, 1, 1, 1, 0.5])
# benefits from a monotnicity pass.
# adaptive_monotonicity_method(buffer)


brute_monotonicity_method(buffer)
adaptive_monotonicity_method(buffer)


#########################################################################
# Plot the resulting buffer
ax.fill_between(x_values, buffer, color="black")  
plt.show()
