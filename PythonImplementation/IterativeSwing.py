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

# Buffer setup
buffer_length = 1000
buffer = np.zeros(buffer_length)  # Initial empty buffer

# Parameters for different method calls
sample_rate = 44100

saw_method(buffer, 0, 1, [1, 1])

'''


# # Apply multiple methods sequentially
# bjorklund_method(
#     buffer,
#     0, 
#     0.5, 
#     [16, 4, 1, 0.4]
# )

# exponent_method(
#     buffer, 
#     0, 
#     1, 
#     [3, 1, 0, 0.5]
# )

# iter1 = buffer.copy()

# bjorklund_method(
#     iter1, 
#     0.5, 
#     1, 
#     [3, 1, 0, 0.5]
# )

# iter2 = iter1.copy()

# bjorklund_method(
#     iter2,
#     0,
#     0.5,
#     [5, 1, 0, 0.5]
# )



# bjorklund_method(
#     iter3,
#     0,
#     0.25,
#     [5, 1, 0, 0.5]
# )

# iter4 = iter3.copy()

# bjorklund_method(
#     buffer, 0.25, 0.5, [5, 1, 0, 0.5]
# )

# iter5 = iter4.copy()

# standard_circle_map_method(
#     buffer,
#     0,
#     1,
#     [5, 0.9, 0, 0.5]  # k, omega, start_value, alpha
# )

# adaptive_monotonicity_method(buffer, 0, 1)


# toussaint_method(buffer, 0, 1, [16, 5, 0, 0.5])

# bresenham_method(buffer, 0, 1, [16, 3, 0, 0.5])
# exponent_method(buffer, 0, 1, [4, 9, 0.8])
# exponent_method(buffer, 0, 1, [4, 0.09, 0.8])
# exponent_method(buffer, 0, 1, [4, 0.09, 0.8])
# exponent_method(buffer, 0, 1, [4, 0.5, 0.8])

# brute_monotonicity_method(buffer)

# phase_density_method(
#     buffer,
#     0,
#     1,
#     [0.5, 0.2, 3, 0.1, 0.4]  # alpha, min_freq, max_freq, min_wake, max_wake
# )

# phase_density_method(
#     buffer,
#     0,
#     1,
#     [0.5, 0.2, 3, 0.1, 0.4]  # alpha, min_freq, max_freq, min_wake, max_wake
# )

'''

superformula_method(
    buffer,
    0,
    1,
    [4, 3, 1, 1, 1, 1, 1, 0.5]  # m1, m2, n1, n2, n3, a, b, alpha
)

buffer2 = buffer.copy()

adaptive_monotonicity_method(buffer2)

# Plot the resulting buffer
x_values = np.linspace(0, 1, buffer_length)  # Map buffer to a 0-1 range
fig, axes = plt.subplots(2, 1, figsize=(10, 12), sharex=True)
axes[0].fill_between(x_values, buffer, color="black")  #[0] #if using multiple subplots
axes[1].fill_between(x_values, buffer2, color="black")
# axes[2].fill_between(x_values, iter3, color="black")
# axes[3].fill_between(x_values, iter4, color="black")
# axes[0].fill_between(x_values, iter1, color="black")
# plt.plot(x_values, buffer, color="black")
# plt.fill_between(x_values, buffer, color="black", alpha=0.3)
for ax in axes:
    ax.axis("off")
fig.subplots_adjust(left=0, right=1, top=1, bottom=0, wspace=0, hspace=0)
plt.tight_layout(pad=0, w_pad=0, h_pad=0)
plt.show()
