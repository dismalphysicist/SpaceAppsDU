import datetime
import spiceypy
import numpy
import pandas
from matplotlib import pyplot as plt

import mplcursors as cursors

spiceypy.furnsh('naif0008.tls')
spiceypy.furnsh('de414_2000_2020.bsp')

datetime_utc=datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
datetime_ET= spiceypy.utc2et(datetime_utc)
print(datetime_utc)
print(datetime_ET)

df = pandas.read_csv("entireexoplanetdata.csv", sep=',')


print(df['ra'])
df['ra']=df['ra']*(numpy.pi/180)-numpy.pi
df['dec']=df['dec']*(numpy.pi/180)
print(df['ra'])

ra=df['ra'].tolist()
dec=df['dec'].tolist()
print(ra)





plt.style.use('dark_background')
plt.figure(figsize=(12, 8))
plt.subplot(projection="aitoff")
plt.title('{datetime_utc} UTC', fontsize=10)
plt.plot(0.5,0.3,marker='o')
#put a variable called exoplanet_graph as the final plot 
exoplanet_graph = plt.scatter(ra,dec)


plt.xticks(ticks=numpy.radians([-150, -120, -90, -60, -30, 0, \
                             30, 60, 90, 120, 150]),
           labels=['10h', '8h', '6h', '4h', '2h', '0h', \
                   '22h', '20h', '18h', '16h', '14h'])
###########################################################################

def acc(name,ind): # access data 
    return str(df[name][ind]) + "\n"

def f(sel):
    ind = sel.target.index 
    labelString = acc('pl_hostname',ind) + "Mass (M_J): "+acc('pl_bmassj',ind) + "Distance (pc): "+acc('gaia_dist',ind) + "Radius (R_J): "+acc('pl_radj',ind) 
    sel.annotation.set_text(labelString)

#download mlpcursors hopefully this will work
cursors.cursor().connect(
    "add", f)

############################################################################
# Plot the labels
plt.xlabel('Right ascension in hours')
plt.ylabel('Declination in deg.')

# Create a legend and grid
plt.legend()
plt.grid(True)

plt.show()